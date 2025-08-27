import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
  }
  interface session {
    user: {
      _id?: string;
      username?: string;
      isAcceptingMessages?: string;
      isVerified?: string;
    } & DefaultSession["user"];
  }
}
