import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {
  const token: RequestCookie | undefined = request.cookies.get("token");

  if (request.nextUrl.pathname.startsWith("/chats") && !!token) {
    try {
      const req = await fetch(`${request.nextUrl.origin}/api/validator`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ token: decodeURIComponent(token.value) }),
      });

      if (req.status === 200) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/chats/:path*",
};
