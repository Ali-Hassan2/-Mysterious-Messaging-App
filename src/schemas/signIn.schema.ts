import { z } from "zod"

const identifierValidation = z.string().email({ message: "Invalid email" })
const passwordValidation = z.string()
const remeberMeValidation = z.boolean().optional()

const signinSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
  remeberMe: remeberMeValidation,
})

export { signinSchema }
