"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signinSchema } from "@/schemas"
import { signIn, SignInResponse } from "next-auth/react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { showToast } from "@/Utils"

const Page = () => {
  const [signingIn, setSigningIn] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
      remeberMe: false,
    },
  })

  useEffect(() => {
    const savedPerson = localStorage.getItem("remebered")

    if (savedPerson) {
      form.setValue("identifier", savedPerson)
      form.setValue("remeberMe", false)
    }
  }, [form])

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      setSigningIn(true)
      if (data.remeberMe) {
        localStorage.setItem("remembered", data.identifier)
      } else {
        localStorage.removeItem("remebered")
      }
      const response: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })
      console.log("The response is:", response)

      if (response?.ok) {
        showToast("Login Successfull!", "success")
        setTimeout(() => {
          router.replace("/dashboard")
        }, 3000)
      } else {
        console.error("Login failed bhai:", response?.error)
        showToast("Login Failed.", "error")
        setSigningIn(false)
      }
    } catch (error: any) {
      if (error instanceof Error) {
        showToast(error?.message || "Something went Wrong. Try Again later.")
      } else {
        showToast("An Unexpected Error occured.")
      }
      //  need to complete card
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen shadow-2xl">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center w-full py-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Anonymous Messaging
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            A project from alitos.com
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Email..."
                      {...field}
                      disabled={signingIn}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password..."
                      {...field}
                      disabled={signingIn}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="remeberMe"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="border-1 flex gap-[10px]">
                      <input
                        type="checkbox"
                        id="remeberMe"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={signingIn}
                      />
                      <FormLabel htmlFor="remeberMe">Remeber Me</FormLabel>
                    </div>
                  </FormItem>
                )
              }}
            />

            <Button type="submit" disabled={signingIn} className="w-full">
              {signingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="flex w-full justify-center items-center gap-2 text-sm">
          <p>Don't have an account?</p>
          <Link
            href="/signup"
            className="text-blue-900 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
