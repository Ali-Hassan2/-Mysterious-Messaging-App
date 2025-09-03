"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/schemas";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    try {
      setSigningIn(true);

      const response = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (response?.ok) {
        router.replace("/dashboard");
      } else {
        console.error("Login failed:", response);
        setSigningIn(false);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setSigningIn(false);
    }
  };

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
  );
};

export default Page;
