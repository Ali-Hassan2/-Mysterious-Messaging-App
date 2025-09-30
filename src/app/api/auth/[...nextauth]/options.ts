import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { UserModel } from "@/model"
import { connect_db } from "@/lib"

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("The credentials we receive are:", { credentials })
        await connect_db()
        const user = await UserModel.findOne({
          $or: [
            { email: credentials.identifier },
            { username: credentials.identifier },
          ],
        })
        console.log("User found jani", user)
        if (!user) {
          console.log("User not found..")
          return null
        }
        if (!user.isVerified) {
          return null
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )
        console.log("Password match:", isCorrectPassword)
        if (!isCorrectPassword) {
          return null
        }

        return userw
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.username = token.username
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.isVerified = token.isVerified
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXT_AUTH_SECRET,
}

export { authOptions }
