"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/schemas";
import { ApiResponse } from "@/types";
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

const page = () => {
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setSigningIn(true);
    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen shadow-2xl">
        <div className="w-full  max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center w-full py-6  text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Anonymous Messaging
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              A project from alitos.com
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email or Username</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Email..." />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Password..." />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" disabled={signingIn}>
                {signingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="flex w-full justify-center items-center gap-2 text-sm">
            <p>Don't have any account ? </p>
            <Link
              href="/signup"
              className="text-blue-900 font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
