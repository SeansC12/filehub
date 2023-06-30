import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT } from "jose";

const channels = ["channel1", "channel2", "channel3"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60; // one hour

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  if (channels.includes(channel)) {
    // Channel exists, so I will create JWT token
    const token = await new SignJWT({
      channel: channel,
      iat: iat,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(secret);

    cookies().set({
      name: channel,
      value: token,
      httpOnly: false,
      path: "/",
    });

    return new NextResponse({
      status: 200,
      statusText: `Successfully connected to ${channel}`,
    });
  }

  return new NextResponse({
    status: 400,
    json: JSON.stringify({
      ChannelError: "Channel does not exist",
    }),
  });
}
