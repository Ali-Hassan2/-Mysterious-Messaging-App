import { Resend } from "resend";

console.log("The api key is:", process.env.RESEND_API_KEY);
if (!process.env.RESEND_API_KEY) {
  throw new Error("Resend api key not found.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };
