import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const optionalString = z.string().optional().default("");
const optionalUrl = z.string().url().or(z.literal("")).default("");
const optionalSecret = z.string().min(10).or(z.literal("")).default("");

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: optionalSecret,
    NEST_API_URL: optionalUrl,
    GOOGLE_CLIENT_ID: optionalString,
    GOOGLE_CLIENT_SECRET: optionalString,
    PAYPAL_CLIENT_ID: optionalString,
    PAYPAL_CLIENT_SECRET: optionalString,
    PAYPAL_BASE_URL: optionalUrl,
    PAYPHONE_TOKEN: optionalString,
    PAYPHONE_STORE_ID: optionalString,
  },

  client: {
    NEXT_PUBLIC_APP_URL: optionalUrl,
    NEXT_PUBLIC_API_URL: optionalUrl,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: optionalString,
    NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY: optionalString,
  },

  runtimeEnv: {
    // server
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
    NEST_API_URL: process.env.NEST_API_URL ?? "",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID ?? "",
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET ?? "",
    PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL ?? "",
    PAYPHONE_TOKEN: process.env.PAYPHONE_TOKEN ?? "",
    PAYPHONE_STORE_ID: process.env.PAYPHONE_STORE_ID ?? "",

    // client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
    NEXT_PUBLIC_PAYPAL_CLIENT_ID:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
    NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY:
      process.env.NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY ?? "",
  },
});
