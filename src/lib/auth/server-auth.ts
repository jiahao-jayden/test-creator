import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { emailOTP } from "better-auth/plugins"
import db from "@/db"
import { sendEmail } from "@/lib/create-email"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        sendEmail({
          to: email,
          subject: "Your Sign In Code",
          from: process.env.RESEND_FROM_EMAIL as string,
          type: "otp",
          options: { otp },
        })
      },
    }),
  ],
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
})

export type Session = typeof auth.$Infer.Session
export const authServer = auth
