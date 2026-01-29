import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string().min(10),

    NEST_API_URL: z.string().url(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    PAYPAL_CLIENT_ID: z.string(),
    PAYPAL_CLIENT_SECRET: z.string(),
    PAYPAL_BASE_URL: z.string().url(),
    PAYPHONE_TOKEN: z.string(),
    PAYPHONE_STORE_ID: z.string(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string(),
    NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY: z.string(),
  },

  runtimeEnv: {
    // server
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEST_API_URL: process.env.NEST_API_URL,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_BASE_URL: process.env.PAYPAL_BASE_URL,

    // client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY:
      process.env.NEXT_PUBLIC_CHAT_WIDGET_CLIENT_KEY,
    PAYPHONE_TOKEN: process.env.PAYPHONE_TOKEN,
    PAYPHONE_STORE_ID: process.env.PAYPHONE_STORE_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
