"use client";

import * as z from "zod";
import { verifySchema } from "@/schemas";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { showToast } from "@/Utils";
import { ApiResponse } from "@/types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyPage = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verifycode", {
        username: params.username,
        code: data.code,
      });
      showToast(response.data.message, "success");
      router.replace("/signin");
    } catch (error) {
      console.log("There is an error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      showToast(err || "Verification failed", "error");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Verify Your Account
          </h1>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your code"
                      maxLength={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-slate-500">
          Didn’t receive a code?{" "}
          <button
            type="button"
            onClick={() =>
              showToast("Resend functionality not implemented", "info")
            }
            className="text-slate-800 font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
