import { z } from "zod";

const usernamevalidation = z
  .string()
  .min(6, { message: "minimum 6 characters" })
  .max(12, "12 maximum characters.")
  .regex(/^[a-zA-Z0-9]+$/, "Username should not have special characters.");

const emailValidation = z.string().email({ message: "Invalid email" });
const passwordValidation = z
  .string()
  .min(8, { message: "Password should have minimun 8 characters." })
  .regex(/[A-Z]/, {
    message: "Password must contain atleast 1 uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must containe atleast 1 lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain 1 number" });

const SignupSchema = z.object({
  username: usernamevalidation,
  email: emailValidation,
  password: passwordValidation,
});

export { SignupSchema };
