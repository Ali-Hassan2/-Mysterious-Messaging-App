import * as z from "zod";
import { verifySchema } from "@/schemas";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { showToast } from "@/Utils";

const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verifycode", {
        username: params.username,
        code: data.code,
      });
      if (!response.ok) {
        const error_Data = await response.json().catch(() => null);
        throw new Error(error_Data?.message || "Cannot resolve verification");
        showToast(error_Data?.message || "Cannot verify.");
      }
      router.replace("/signin");
      showToast("Verification complelte! ");
    } catch (error) {
      console.log("There is an error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const err = axiosError.response?.data.message;
      showToast(err, "error");
    }
  };
  return <div>Hello this is the verification page</div>;
};

export default page;
