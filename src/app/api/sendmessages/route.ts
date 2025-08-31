import { IMessage, UserModel } from "@/model";
import { connect_db } from "@/lib";

export async function POST(request: Request) {
  await connect_db();

  try {
    const { username, content } = await request.json();

    const userExist = await UserModel.findOne({ username });

    if (!userExist) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (!userExist.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages.",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    userExist.messages.push(newMessage as IMessage);
    await userExist.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending message:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
