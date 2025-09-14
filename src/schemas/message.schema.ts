import { z } from "zod"
const contentValidation = z
  .string()
  .min(1, { message: "Message should be atleast one characher long." })
  .max(500, { message: "Message can be 500 characters long." })

const createdatValidation = z
  .date()
  .optional()
  .default(() => new Date())

const messageSchema = z.object({
  content: contentValidation,
  createdar: createdatValidation,
})

export { messageSchema }
