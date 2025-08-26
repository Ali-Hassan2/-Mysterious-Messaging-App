import { z } from "zod";

const contentValidation = z
  .string()
  .min(1, { message: "Message should atleast have one character." })
  .max(500, { message: "Message should can have 500 characters." });
const createdatValidation = z
  .date()
  .optional()
  .default(() => new Date());

const messageSchema = z.object({
  content: contentValidation,
  createdat: createdatValidation,
});

export { messageSchema };
