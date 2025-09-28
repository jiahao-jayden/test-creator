import { render } from "@react-email/components"
import { Resend } from "resend"
import OTPEmail from "@/components/email/otp-email"

export interface EmailData {
  to: string
  subject: string
  from: string
  type: string
  options: Record<string, any>
}

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (data: EmailData): Promise<void> => {
  let emailHtml: string

  if (data.type === "otp") {
    emailHtml = await render(OTPEmail({ otp: data.options?.otp }))
  } else {
    return
  }

  await resend.emails.send({
    from: data.from,
    to: data.to,
    subject: data.subject,
    html: emailHtml,
  })
}
