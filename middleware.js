import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: "/api/authoriseChannel",
};

export async function middleware(request) {
  const cookieOfChannel = request.cookies.getAll()[0];

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  try {
    await jwtVerify(cookieOfChannel.value + "h", secret);
    NextResponse.next();
  } catch (err) {
    const response = new NextResponse(
      JSON.stringify({ error: "Invalid JWT" }),
      { status: 401, statusText: "Invalid JWT" }
    );

    response.cookies.delete(cookieOfChannel.name);

    return response;
  }
}
