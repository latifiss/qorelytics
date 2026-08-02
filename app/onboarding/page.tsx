import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";

import OnboardingClient from "./onboarding-client";


export default async function OnboardingPage() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    redirect("/signin");
  }


  const profile = await prisma.profile.findUnique({
    where:{
      userId: session.user.id,
    },
  });


  if(profile?.onboardingCompleted){
    redirect("/");
  }


  return <OnboardingClient />;

}