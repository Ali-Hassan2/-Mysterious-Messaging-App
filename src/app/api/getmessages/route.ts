import { connect_db } from "@/lib"
import { UserModel } from "@/model"
import mongoose from "mongoose"

export async function GET(request: Request) {
  await connect_db()

  // 🚨 TEMPORARY HARDCODED USER ID for testing
  const userId = new mongoose.Types.ObjectId("68b8477fdaf9d9aceed25633")

  try {
    const userAgg = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ])

    if (!userAgg || userAgg.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or no messages",
        },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: "Messages retrieved successfully",
      messages: userAgg[0].messages,
    })
  } catch (error: any) {
    console.log("There is an error", error)
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error?.message,
      },
      { status: 500 }
    )
  }
}
