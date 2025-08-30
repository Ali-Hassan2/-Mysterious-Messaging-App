import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if(token && (
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/signup') || 
    url.pathname.startsWith('/verify') || 
    url
  ))
}
const config = {
  matcher: ["/signin", "/signup", "/"],
};
