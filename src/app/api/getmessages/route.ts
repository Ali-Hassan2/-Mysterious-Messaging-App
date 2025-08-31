import { getServerSession } from "next-auth";
import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  const session = await getServerSession();
  const user: User = session?.user as User;
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User Not Authenticated.",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  // TODO: will learn about mongodb aggregations
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user) {
      return Response.json(
        {
          success: false,
          messages: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json({
      success: true,
      message: "Messages reterived successfully",
      messages: user[0].messages,
    });
  } catch (error) {
    console.log("Ther is an error", error);
    return Response.json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
}
