import { connect_db } from "@/lib"
import { UserModel } from "@/model"
import { usernamevalidation } from "@/schemas"
import { z } from "zod"

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
})

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return Response.json({
      success: false,
      message: "Method Not Allowed.",
    })
  }

  await connect_db()
  const { searchParams } = new URL(request.url)
  const queryParms = {
    username: searchParams.get("username") ?? "",
  }

  const result = UsernameQuerySchema.safeParse(queryParms)
  console.log("The result is:", result)
  if (!result.success) {
    const usernameErrors = result.error.format().username?._errors || []
    return Response.json(
      {
        success: false,
        message:
          usernameErrors?.length > 0
            ? usernameErrors?.join(", ")
            : "invalid query Params",
      },
      {
        status: 400,
      }
    )
  }
  try {
    const { username } = result.data
    const isUsernameExist = await UserModel.findOne({
      username,
      isVerified: true,
    })
    if (!isUsernameExist) {
      return Response.json(
        {
          success: false,
          message: "No user found with this username",
        },
        {
          status: 404,
        }
      )
    }
    return Response.json(
      {
        success: true,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    const error_message =
      error instanceof Error ? error?.message : "Unexpected Error occured."
    return Response.json({
      success: false,
      message: error_message,
    })
  }
}
