import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isAcceptingMessages?: string;
      isVerified?: string;
    } & DefaultSession["user"];
  }
}

// we can write jwt interfce as
declare module "next-auth/jwt";{
  interface JWT{
    _id?:string,
    username?:string,
    isAcceptingMessages
  }
}
