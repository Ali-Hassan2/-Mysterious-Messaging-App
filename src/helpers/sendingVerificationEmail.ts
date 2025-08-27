import { resend } from "@/resend";
import { VerificationEmail } from "@/emails";
import { ApiResponse } from "@/types";

const sendingemail = async ({
  email,
  username,
  verifycode,
}): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "alihassan26032004@gmail.com",
      to: email,
      subject: "Verfication Code...",
      react: VerificationEmail({ username: username, otp: verifycode }),
    });
    return {
      success: true,
      message: "Failed to send verification Code.",
    };
  } catch (emailError) {
    return {
      success: false,
      message: "Failed to send verification Code.",
    };
  }
};

export { sendingemail };
