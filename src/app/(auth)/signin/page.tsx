"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinSchema } from "@/schemas";
import { ApiResponse } from "@/types";
import { signIn } from "next-auth/react";

const page = () => {
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      redirect: false,
      identifier: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setSigningIn(true);
    const response = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
    });
  };
  return (
    <>
      <div></div>
    </>
  );
};
