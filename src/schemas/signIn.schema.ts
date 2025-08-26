import { z } from "zod";

const identifierValidation = z.string().email({ message: "Invalid email" });
const passwordValidation = z.string();

const signinSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});

export { signinSchema };
