import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/src/lib/db/prisma";


export const auth = betterAuth({

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),


  emailAndPassword: {
    enabled: true,
  },


  socialProviders: {

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },


    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },

  },

});