import { NextAuthOptions } from "next-auth";
import Credentials, {
  CredentialsProvider,
} from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { UserModel } from "@/model";
import { connect_db } from "@/lib";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Your email..." },
        password: {
          label: "password",
          type: "password",
          placeholder: "Your password",
        },
        async authorize(credentials: any): Promise<any> {
          await connect_db();
          try {
            const user = await UserModel.findOne({
              $or: [
                { email: credentials.identifier },
                { username: credentials.identifier },
              ],
            });
            if (!user) {
              throw new Error("No user found with this email");
            }
            if (!user.isVerified) {
              throw new Error("Please verfiy you account first.");
            }
            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isCorrectPassword) {
              return user;
            } else {
              throw new Error("Incorrect Password.");
            }
          } catch (error) {}
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
