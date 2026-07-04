import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminFromRequestEdge, getStudentFromRequestEdge } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const admin = await getAdminFromRequestEdge(request);
    if (!admin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/student/dashboard")) {
    const student = await getStudentFromRequestEdge(request);
    if (!student) {
      const loginUrl = new URL("/student/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/dashboard/:path*"],
};
