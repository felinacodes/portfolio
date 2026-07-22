import { NextRequest } from "next/server";
import { getIp } from "@/lib/server/getIp";
import { rateLimit } from "@/lib/server/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getIp(req);

  const body = await req.json();

  const sticker = String(body.sticker || "");
  const color1 = String(body.color1 || "");
  const color2 = String(body.color2 || "");
  const signature = String(body.signature || "");
  const website = String(body.website || "");
  const turnstileToken = String(body.turnstileToken || "");

  if (website) {
    return Response.json({
      success: true,
    });
  }

  if (
    rateLimit({
      key: "messages",
      ip,
      maxRequests: 20,
      windowMs: 60 * 60 * 1000,
    })
  ) {
    return Response.json(
      {
        success: false,
        error: "You already left a gift.",
      },
      {
        status: 429,
      },
    );
  }

  if (!turnstileToken) {
    return Response.json(
      {
        success: false,
        error: "Verification token missing.",
      },
      { status: 400 },
    );
  }

  let result: { success: boolean };

  try {
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY!,
          response: turnstileToken,
          remoteip: ip,
        }),
      },
    );

    result = await verify.json();
  } catch (error) {
    console.error("Turnstile verification failed:", error);

    return Response.json(
      {
        success: false,
        error: "Verification service unavailable.",
      },
      { status: 503 },
    );
  }

  if (!result.success) {
    return Response.json(
      {
        success: false,
        error: "Verification failed.",
      },
      { status: 400 },
    );
  }

  if (!sticker) {
    return Response.json(
      {
        success: false,
        error: "Missing sticker",
      },
      {
        status: 400,
      },
    );
  }

  if (!signature) {
    return Response.json(
      {
        success: false,
        error: "Please add your signature.",
      },
      {
        status: 400,
      },
    );
  }

  // ------------------------------------------ //

  return Response.json({
    success: true,

    message: {
      id: crypto.randomUUID(),
      sticker,
      color1,
      color2,
      signature,
    },
  });
}
