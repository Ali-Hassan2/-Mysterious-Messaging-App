import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Public paths that don't require auth
  const publicPaths = ["/signin", "/signup", "/verify", "/"];

  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  // 🔹 Case 1: User is not logged in and trying to access a protected page
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 🔹 Case 2: User is logged in and trying to access a public page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 🔹 Case 3: Everything else is fine
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/verify/:path*", "/dashboard/:path*"],
};
