import webPush, { type PushSubscription } from "web-push";
import { addNotificationLog, getSubscriptionsForRecipient } from "./notification-store";

type NotificationPayload = {
  title: string;
  body: string;
  targetUrl?: string;
  tag?: string;
};

function getVapidConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || "";
  const privateKey = process.env.VAPID_PRIVATE_KEY || "";
  const subject = process.env.VAPID_SUBJECT || "mailto:editor@newsroom.local";

  return { publicKey, privateKey, subject, configured: Boolean(publicKey && privateKey) };
}

function configureWebPush() {
  const config = getVapidConfig();

  if (!config.configured) return config;

  webPush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return config;
}

function toPushSubscription(record: { endpoint: string; p256dh: string; auth: string }): PushSubscription {
  return {
    endpoint: record.endpoint,
    keys: {
      p256dh: record.p256dh,
      auth: record.auth,
    },
  };
}

export function getPublicVapidKeyStatus() {
  const config = getVapidConfig();
  return { publicKey: config.publicKey, configured: config.configured };
}

export async function sendMobileNotificationToRecipient(recipientEmail: string, payload: NotificationPayload) {
  const config = configureWebPush();
  const subscriptions = getSubscriptionsForRecipient(recipientEmail);

  if (!config.configured) {
    addNotificationLog({
      channel: "WEB_PUSH",
      recipient: recipientEmail,
      title: payload.title,
      body: payload.body,
      targetUrl: payload.targetUrl,
      status: "SKIPPED",
      errorMessage: "VAPID keys are not configured",
    });
    return { sent: 0, skipped: true, reason: "VAPID keys are not configured" };
  }

  if (!subscriptions.length) {
    addNotificationLog({
      channel: "WEB_PUSH",
      recipient: recipientEmail,
      title: payload.title,
      body: payload.body,
      targetUrl: payload.targetUrl,
      status: "SKIPPED",
      errorMessage: "No subscribed mobile device found",
    });
    return { sent: 0, skipped: true, reason: "No subscribed mobile device found" };
  }

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    targetUrl: payload.targetUrl || "/dashboard",
    tag: payload.tag || "news-risk-monitor",
  });

  let sent = 0;

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(toPushSubscription(subscription), body);
        sent += 1;
        addNotificationLog({
          channel: "WEB_PUSH",
          recipient: subscription.userEmail,
          title: payload.title,
          body: payload.body,
          targetUrl: payload.targetUrl,
          status: "SENT",
        });
      } catch (error) {
        addNotificationLog({
          channel: "WEB_PUSH",
          recipient: subscription.userEmail,
          title: payload.title,
          body: payload.body,
          targetUrl: payload.targetUrl,
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message : "Unknown web push error",
        });
      }
    }),
  );

  return { sent, skipped: false };
}
