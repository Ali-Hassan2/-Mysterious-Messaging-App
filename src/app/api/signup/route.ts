import { UserModel } from "@/model";
import { sendingemail } from "@/helpers";
import { connect_db } from "@/lib";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connect_db();
  try {
    const { username, email, password } = await request.json();
    console.log("The data is:", { username, email, password });
    const existinguserwithusername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existinguserwithusername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already occupied",
        },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existinguserwithemail = await UserModel.findOne({ email });

    if (existinguserwithemail) {
      if (existinguserwithemail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already verified with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existinguserwithemail.password = hashedPassword;
        existinguserwithemail.verifyCode = otp;
        existinguserwithemail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1hr
        await existinguserwithemail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
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

      await newUser.save();
    }

    const emailResponse = await sendingemail({
      email,
      username,
      verifycode: otp,
    });

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message || "Failed to send email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error: any) {
    console.error("Error registering user.", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
};
