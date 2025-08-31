import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { usernamevalidation } from "@/schemas";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

async function GET(request: Request) {
  await connect_db();
  const { searchParams } = new URL(request.url);
  const queryParams = {
    username: searchParams.get("username"),
  };
  const result = UsernameQuerySchema.safeParse(queryParams);
  console.log("The result is:", result);
  if (!result.success) {
    const usernameErrors = result.error.format().username?._errors || [];
    return Response.json(
      {
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors?.join(", ")
            : "Invalid query params",
      },
      {
        status: 400,
      }
    );
  }
  try {
  } catch (error) {
    console.log("Error while checking username", error);
    return Respons.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
