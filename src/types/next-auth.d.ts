import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isAcceptingMessages?: boolean;
    isVerified?: boolean;
  }
}
