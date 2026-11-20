import type { NotificationLog, UserRole, WebPushSubscriptionRecord } from "./types";

const SUBSCRIPTION_STORE_KEY = "__newsRiskWebPushSubscriptions";
const LOG_STORE_KEY = "__newsRiskNotificationLogs";

type RuntimeGlobal = typeof globalThis & {
  [SUBSCRIPTION_STORE_KEY]?: WebPushSubscriptionRecord[];
  [LOG_STORE_KEY]?: NotificationLog[];
};

function subscriptionStore() {
  const runtime = globalThis as RuntimeGlobal;
  runtime[SUBSCRIPTION_STORE_KEY] ||= [];
  return runtime[SUBSCRIPTION_STORE_KEY];
}

function logStore() {
  const runtime = globalThis as RuntimeGlobal;
  runtime[LOG_STORE_KEY] ||= [];
  return runtime[LOG_STORE_KEY];
}

export function upsertWebPushSubscription(input: {
  userEmail: string;
  role: UserRole;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}) {
  const store = subscriptionStore();
  const now = new Date().toISOString();
  const existingIndex = store.findIndex((subscription) => subscription.endpoint === input.endpoint);
  const record: WebPushSubscriptionRecord = {
    id: existingIndex >= 0 ? store[existingIndex].id : `wps-${Date.now()}`,
    ...input,
    createdAt: existingIndex >= 0 ? store[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store[existingIndex] = record;
  } else {
    store.unshift(record);
  }

  return record;
}

export function getWebPushSubscriptions() {
  return subscriptionStore();
}

export function getSubscriptionsForRecipient(userEmail: string, fallbackRoles: UserRole[] = ["EDITOR", "ADMIN"]) {
  const normalizedEmail = userEmail.toLowerCase();
  const store = subscriptionStore();
  const exactMatches = store.filter((subscription) => subscription.userEmail.toLowerCase() === normalizedEmail);

  if (exactMatches.length) return exactMatches;

  return store.filter((subscription) => fallbackRoles.includes(subscription.role));
}

export function addNotificationLog(log: Omit<NotificationLog, "id" | "createdAt">) {
  const record: NotificationLog = {
    id: `noti-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    ...log,
  };

  logStore().unshift(record);
  return record;
}

export function getNotificationLogs() {
  return logStore();
}
