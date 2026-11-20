self.addEventListener("push", (event) => {
  let payload = {
    title: "News Risk Monitor",
    body: "มีรายการใหม่ที่ต้องตรวจสอบ",
    targetUrl: "/dashboard",
    tag: "news-risk-monitor",
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag,
      icon: "/news-risk-icon.svg",
      badge: "/news-risk-icon.svg",
      data: {
        targetUrl: payload.targetUrl,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.targetUrl || "/dashboard";
  const url = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client && client.url === url) {
          return client.focus();
        }
      }

      return self.clients.openWindow(url);
    }),
  );
});
