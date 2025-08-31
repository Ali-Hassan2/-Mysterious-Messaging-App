import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session?.user) {
    return Response.json({
      success: false,
      message: "User not Authenticated",
    });
  }
  const userId = user._id;
  const { acceptingmessagesFlag } = await request.json();
  try {
    const updatedUserWithFlag = await findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptingmessagesFlag,
      },
      { new: true }
    );
    if (updatedUserWithFlag) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }
  } catch (error) {}
}
