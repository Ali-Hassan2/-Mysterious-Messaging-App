import { UserModel } from "@/model";
import { sendingemail } from "@/helpers";
import { connect_db } from "@/lib";
import { sendingemail } from "@/helpers";
import bcrypt from "bcrypt";

const POST = async (request: Request, response: Response) => {
  await connect_db();
  try {
    const { username, email, password } = await Request.json();
    const existinguserwithusername = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existinguserwithusername) {
      return response
        .json({
          success: false,
          message: "Username is already occupied",
        })
        .status(400);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existinguserwithemail = await UserModel.findOne({
      email,
    });
    if (existinguserwithemail) {
      if
    } else {
      // user comes first time
      const hashedPassword = await bcrypt.hash(10, password);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: otp,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
    }
    await newUser.save();
    //sending verfication email

    const emailResponse = await sendingemail(email, username, otp);
    if (!emailResponse) {
      return response.json(
        {
          success: false,
          message: emailResponse?.message,
        },
        { status: 500 }
      );
    }
    return Response.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user.", error);
    return Response.json({
      success: false,
      message: "Error registering user.",
      error: error?.message,
    }).status(500);
  }
};
