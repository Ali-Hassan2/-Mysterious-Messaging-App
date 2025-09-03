"use client";

import { useRouter } from "next/navigation";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { showToast } from "@/Utils";
import { SignupSchema } from "@/schemas";
import { ApiResponse } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameMessage("");
        return;
      }

      setIsCheckingUsername(true);
      setUsernameMessage("");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const { data } = await axios.get<ApiResponse>(
          `/api/checkusernameunique?username=${username}`,
          { signal: controller.signal }
        );

        setUsernameMessage(data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ||
            "Error checking username, try again later"
        );
      } finally {
        clearTimeout(timeout);
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      setIsSubmiting(true);
      const response = await axios.post<ApiResponse>("/api/signup");
      const message = response.data.message;
      showToast(message, "success");
      router.replace(`/verify/code?username=${username}`);
      setIsSubmiting(false);
    } catch (error) {
      console.log("The error is:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      showToast(err, "error");
      setIsSubmiting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen  border-2 border-red-500">
        <div className="w-full border-4 border-red-600 max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center w-full py-6 border-2 border-blue-600 text-center">
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
                name="username"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                        />
                      </FormControl>
                      {isCheckingUsername ?? (
                        <Loader2 className="animate-spin" />
                      )}
                      <p
                        className={`text-sm ${
                          usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-600"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" disabled={isSubmiting}>
                {isSubmiting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Page;
