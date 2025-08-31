import { connect_db } from "@/lib";
import { UserModel } from "@/model";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        message: "Method not allowed.",
      },
      {
        status: 405,
      }
    );
  }

  await connect_db();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 400,
        }
      );
    }
    const isValidCode = user.verifyCode === code;
    const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isValidCode && isNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Your code is expired please sign up again to get a new code.",
        },
        {
          status: 405,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Your code is incorrect",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("There is an error,", error);
    return Response.json({
      success: false,
      message: "There is an Internal Server Error",
      error: error?.message,
    });
  }
}
