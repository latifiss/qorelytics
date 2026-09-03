import { PostHog } from "posthog-node";

const posthogKey = process.env.POSTHOG_KEY;
const posthogHost = process.env.POSTHOG_HOST || "https://us.i.posthog.com";

export const posthog = posthogKey
  ? new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
    })
  : null;
