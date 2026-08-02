import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth/auth";
import { prisma } from "@/src/lib/db/prisma";


export async function POST(req: Request) {

  try {

    const session = await auth.api.getSession({
      headers: req.headers,
    });


    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const data = await req.json();


    await prisma.profile.upsert({

      where:{
        userId: session.user.id,
      },

      update:{
        ...data,
        onboardingCompleted:true,
      },

      create:{
        userId: session.user.id,
        ...data,
        onboardingCompleted:true,
      },

    });


    return NextResponse.json({
      success:true,
    });


  } catch(error){

    console.error(error);

    return NextResponse.json(
      {error:"Something went wrong"},
      {status:500}
    );

  }

}