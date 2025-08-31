import { connect_db } from "@/lib";
import { UserModel } from "@/model";
import { usernamevalidation } from "@/schemas";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

async function GET(request: Request) {
  await connect_db();
  try {
  } catch (error) {
    console.log("Error while checking username", error);
    return Respons.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
