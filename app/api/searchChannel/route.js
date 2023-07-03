import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const client = await clientPromise;
  const db = client.db("sample_mflix");

  const cursor = await db
    .collection("comments")
    .find({ name: { $regex: "Mercedes" } })
    .limit(20)
    .toArray();

  console.log(JSON.parse(JSON.stringify(cursor)));

  return new NextResponse(
    JSON.stringify({ data: cursor }),
    { status: 200, statusText: "OK" }
  );
}
