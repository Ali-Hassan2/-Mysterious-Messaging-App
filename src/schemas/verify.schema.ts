import { z } from "zod";

const verifycodeValidation = z
  .string()
  .min(6, { message: "Code should be exactly 6 characters long." })
  .max(6, { message: "Code should be exactly 6 characters long." });

const verifySchema = z.object({
  verifycode: verifycodeValidation,
});

export { verifySchema };
