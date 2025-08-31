import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { usernamevalidation } from "@/schemas";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return Response.json({
      success: false,
      message: "Mehod Not allowed.",
    });
  }
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
  const { username } = result.data;
  const existingVerifiedUser = await UserModel.findOne({
    username,
    isVerified: true,
  });
  if (existingVerifiedUser) {
    return Response.json(
      {
        success: false,
        message: "Username already taken",
      },
      {
        status: 400,
      }
    );
  }
  return Response.json(
    {
      success: true,
      message: "Username is unique",
    },
    {
      status: 200,
    }
  );
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
