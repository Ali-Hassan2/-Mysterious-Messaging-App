import { z } from "zod";

const acceptingValidation = z.boolean();
const acceptingSchema = z.object({
  isacceptingmessages: acceptingValidation,
});
export { acceptingSchema };
