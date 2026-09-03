import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Workspace | Qorelytics",
  description: "Your private Qorelytics AI data analytics workspace.",
  robots: { index: false, follow: false },
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!profile || !profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <HomeClient
      userName={session.user.name}
    />
  );
}
