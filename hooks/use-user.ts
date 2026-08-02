"use client";

import { authClient } from "@/src/lib/auth/client";

export function useUser() {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    loading: isPending,
    authenticated: !!data?.user,
  };
}