import { NextResponse } from "next/server";

export async function POST() {
  return new NextResponse(
    JSON.stringify({ message: "Valid JWT" }),
    { status: 200, statusText: "Valid JWT" }
  );
}
