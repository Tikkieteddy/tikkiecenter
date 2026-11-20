"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function MobileNotificationControl({
  userEmail = "editor@newsroom.co.th",
  role = "EDITOR",
}: {
  userEmail?: string;
  role?: "ADMIN" | "EDITOR" | "LEGAL_REVIEWER" | "VIEWER";
}) {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("ตรวจสถานะ...");

  useEffect(() => {
    const isSupported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(isSupported);
    setPermission(isSupported ? Notification.permission : "denied");

    fetch("/api/notifications/vapid-public-key")
      .then((response) => response.json())
      .then((data) => {
        setConfigured(Boolean(data.configured));
        setMessage(data.configured ? "พร้อมเปิดแจ้งเตือนมือถือ" : "ต้องตั้งค่า VAPID keys ก่อนส่ง push จริง");
      })
      .catch(() => setMessage("ตรวจสถานะ notification ไม่สำเร็จ"));
  }, []);

  async function enableNotifications() {
    setLoading(true);
    setMessage("");

    try {
      if (!supported) {
        throw new Error("เบราว์เซอร์นี้ยังไม่รองรับ Web Push");
      }

      const keyResponse = await fetch("/api/notifications/vapid-public-key");
      const keyData = await keyResponse.json();

      if (!keyData.configured || !keyData.publicKey) {
        throw new Error("ยังไม่ได้ตั้งค่า NEXT_PUBLIC_VAPID_PUBLIC_KEY และ VAPID_PRIVATE_KEY");
      }

      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        throw new Error("ผู้ใช้ยังไม่ได้อนุญาต notification");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
        }));

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, role, subscription }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "สมัครรับแจ้งเตือนไม่สำเร็จ");
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "เปิดแจ้งเตือนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  async function sendTestNotification() {
    setLoading(true);

    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: userEmail }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("ส่งทดสอบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2 rounded-lg border border-border bg-white/78 p-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-bold text-slate-500">แจ้งเตือนมือถือ</p>
        {permission === "granted" ? <Bell className="size-4 shrink-0 text-green-600" /> : <BellOff className="size-4 shrink-0 text-slate-400" />}
      </div>
      <p className="max-h-9 overflow-hidden text-xs leading-[1.15rem] text-slate-600">{message}</p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="h-8 min-h-8 px-2 text-xs"
          type="button"
          size="sm"
          onClick={enableNotifications}
          disabled={loading || !supported || !configured}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Bell />}
          เปิด
        </Button>
        <Button className="h-8 min-h-8 px-2 text-xs" type="button" size="sm" variant="outline" onClick={sendTestNotification} disabled={loading}>
          <Send />
          ทดสอบ
        </Button>
      </div>
    </div>
  );
}
