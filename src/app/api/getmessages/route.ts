import { getServerSession } from "next-auth";
import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connect_db();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "user not authenticated",
    });
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const userAgg = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    if (!userAgg || userAgg.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found or no messages.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Messages retrieved successfully.",
      messages: userAgg[0].messages,
    });
  } catch (error: any) {
    console.error("An error occurred:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
        error: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}
