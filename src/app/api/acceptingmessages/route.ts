import { connect_db } from "@/lib"
import { UserModel } from "@/model"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { User } from "next-auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const user: User = session?.user as User
  if (!session || !session?.user) {
    return Response.json({
      success: false,
      message: "User not Authenticated",
    })
  }
  await connect_db()
  const userId = (user as any)._id || (user as any).id
  console.log("The user idd is:", userId)
  const { acceptingmessagesFlag } = await request.json()
  console.log("The request got.................", acceptingmessagesFlag)
  try {
    const updatedUserWithFlag = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptingmessagesFlag,
      },
      { new: true }
    )
    if (!updatedUserWithFlag) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      )
    }
    return Response.json({
      success: true,
      message: "User accepting Messgaes Flag updated.",
      updatedUserWithFlag,
    })
  } catch (error) {
    console.log("There is an error", error)
    return Response.json({
      success: false,
      message: "Internal Server error",
      error: error?.message,
    })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      { status: 401 }
    )
  }
  await connect_db()
  const user = session.user as User

  try {
    const userId = (user as any)._id || (user as any).id

    const UserExist = await UserModel.findById(userId)
    if (!UserExist) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: "User Found successfully",
      isAcceptingMessages: UserExist.isAcceptingMessages,
    })
  } catch (error) {
    console.log("There is an error", error)
  }
}
