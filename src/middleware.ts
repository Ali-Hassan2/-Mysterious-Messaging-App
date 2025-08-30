import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
async function middleware(request: NextRequest) {}
const config = {
  matcher: ["/signin", "/signup", "/"],
};
