import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";
import { headers } from "next/headers";

export default async function AuthSuccessPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  // First time user
  if (!profile) {
    await prisma.profile.create({
      data: {
        userId: session.user.id,
      },
    });

    redirect("/onboarding");
  }

  // Returning user who has not finished onboarding
  if (!profile.onboardingCompleted) {
    redirect("/onboarding");
  }

  // Existing completed user
  redirect("/");
}