import { betterAuth } from "better-auth";
import { oAuthProxy } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/src/lib/db/prisma";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "qorelytics-nine.vercel.app",
      "qorelytics-*.vercel.app",
      "localhost:3000",
    ],
    protocol: "https",
  },

  trustedOrigins: [
    "https://qorelytics-nine.vercel.app",
    "https://qorelytics-*.vercel.app",
    "http://localhost:3000",
  ],

  plugins: [
    oAuthProxy({
      productionURL: "https://qorelytics-nine.vercel.app",
      secret: process.env.OAUTH_PROXY_SECRET,
    }),
  ],

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
