import { z } from "zod";

const verifycodeValidation = z
  .string()
  .minLength(6, { message: "Code should b 6 chars long." })
  .max(6, { message: "Code should be 6 chars max" });

const verifySchema = z.object({
  verifycode: verifycodeValidation,
});

export { verifySchema };
