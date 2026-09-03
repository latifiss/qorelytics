"use client";

import { useEffect } from "react";

const STORAGE_KEY = "qorelytics_analytics_id";

function getDistinctId() {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      distinctId: getDistinctId(),
      properties,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export default function PostHogAnalytics() {
  useEffect(() => {
    trackEvent("page_view", {
      path: window.location.pathname,
      title: document.title,
    });
  }, []);

  return null;
}
