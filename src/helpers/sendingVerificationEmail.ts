import { resend } from "@/resend";
import { VerificationEmail } from "@/emails";
import { ApiResponse } from "@/types";

const sendingemail = async ({
  email,
  username,
  verifycode,
}): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: "alihassan26032004@gmail.com",
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifycode }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        message: "Failed to send verification code.",
      };
    }

    console.log("Email sent:", data);
    console.log("The verification code is:", verifycode);
    return {
      success: true,
      message: "Verification code sent successfully!",
    };
  } catch (emailError: any) {
    console.error("Unexpected error:", emailError);
    return {
      success: false,
      message: "Failed to send verification code.",
    };
  }
};

export { sendingemail };
