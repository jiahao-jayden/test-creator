"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, Loader2, LogIn } from "lucide-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { authClient } from "@/lib/auth/client-auth"
import { cn } from "@/lib/utils"
import { DeviconGoogle } from "../icon/google"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Separator } from "../ui/separator"

type Step = "email" | "otp"

const emailSchema = z.object({
  email: z.email(),
})

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the 6-digit code"),
})

type EmailFormData = z.infer<typeof emailSchema>
type OtpFormData = z.infer<typeof otpSchema>

export function SignIn() {
  const [step, setStep] = useState<Step>("email")
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Dialog 关闭时重置状态
      setStep("email")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="font-medium"
        >
          <LogIn className="size-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-96 p-0 overflow-hidden">
        <div className="p-6 pb-4">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
              <LogIn className="size-6 text-primary" />
            </div>
            <div className="space-y-2">
              {step === "email" ? (
                <>
                  <DialogTitle className="text-2xl font-semibold">Welcome Back</DialogTitle>
                  <p className="text-muted-foreground text-sm">
                    Sign in to your account to continue
                  </p>
                </>
              ) : (
                <>
                  <DialogTitle className="text-2xl font-semibold">Check your email</DialogTitle>
                  <p className="text-muted-foreground text-sm">
                    Enter the verification code we sent you
                  </p>
                </>
              )}
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <SigInWithEmail
            step={step}
            setStep={setStep}
          />
          {step === "email" && <SigInWithSocial />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SigInWithEmail({ step, setStep }: { step: Step; setStep: (step: Step) => void }) {
  const [email, setEmail] = useState("")

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  // Dialog 关闭时重置表单
  React.useEffect(() => {
    if (step === "email") {
      emailForm.reset()
      otpForm.reset()
      setEmail("")
    }
  }, [step, emailForm, otpForm])

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: async (data: EmailFormData) => {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "sign-in",
      })
      return result
    },
    onSuccess: (_, data) => {
      setEmail(data.email)
      setStep("otp")
    },
  })

  const {
    mutate: verifyOtp,
    isPending: isVerifyingOtp,
    error: verifyOtpError,
  } = useMutation({
    mutationFn: async (data: OtpFormData) => {
      const result = await authClient.signIn.emailOtp({
        email: email,
        otp: data.otp,
      })

      return result
    },
    onSuccess: (result) => {
      if (result.error) {
        otpForm.setError("otp", { message: "Invalid OTP" })
        return
      }
      console.log(result.error, "result.error")

      // Handle successful sign in
      window.location.reload()
    },
    onError: () => {
      otpForm.setError("otp", { message: "Invalid OTP" })
    },
  })

  const onEmailSubmit = (data: EmailFormData) => {
    sendOtp(data)
  }

  const onOtpSubmit = (data: OtpFormData) => {
    verifyOtp(data)
  }

  const goBack = () => {
    setStep("email")
    otpForm.reset()
  }

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            We sent a verification code to <br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-4"
          >
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        {...field}
                        className={cn(
                          fieldState.error || (!!verifyOtpError && "border-destructive")
                        )}
                      >
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className={cn(
                                fieldState.error || (!!verifyOtpError && "border-destructive")
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full font-medium"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={goBack}
                disabled={isVerifyingOtp}
              >
                <ArrowLeft className="size-4 mr-2" />
                Back to email
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        className="space-y-4"
      >
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  disabled={isSendingOtp}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full font-medium"
          disabled={isSendingOtp}
        >
          {isSendingOtp ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
              Sending code...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  )
}

function SigInWithSocial() {
  const { mutate: signInWithGoogle, isPending: isSigningWithGoogle } = useMutation({
    mutationFn: async () => {
      const result = await authClient.signIn.social({
        provider: "google",
      })
      return result
    },
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        className="w-full h-11 font-medium"
        variant="outline"
        type="button"
        disabled={isSigningWithGoogle}
        onClick={() => signInWithGoogle()}
      >
        {isSigningWithGoogle ? (
          <Loader2 className="size-4 mr-2 animate-spin" />
        ) : (
          <DeviconGoogle className="size-4 mr-2" />
        )}
        Sign in with Google
      </Button>
    </div>
  )
}
