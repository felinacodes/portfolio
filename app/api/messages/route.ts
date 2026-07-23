import { NextRequest } from "next/server";
import { getIp } from "@/lib/server/getIp";
import { rateLimit } from "@/lib/server/rateLimit";
import { supabase } from "@/lib/server/supabase";
import type { StickerName } from "@/lib/stickerMap";
import { LeaveMessage } from "@/lib/fetchMessages";

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

  if (signature.length > 500000) {
    return Response.json(
      {
        success: false,
        error: "Signature file is too large.",
      },
      {
        status: 400,
      },
    );
  }

  // ------------------------------------------ //

  const fileName = `${crypto.randomUUID()}.png`;

  const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");

  const buffer = Buffer.from(base64Data, "base64");

  const { error: uploadError } = await supabase.storage
    .from("Portfolio - Signatures")
    .upload(fileName, buffer, {
      contentType: "image/png",
    });

  if (uploadError) {
    return Response.json(
      {
        success: false,
        error: "Signature upload failed.",
      },
      {
        status: 500,
      },
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("Portfolio - Signatures")
    .getPublicUrl(fileName);

  const signatureUrl = publicUrlData.publicUrl;

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      sticker_name: sticker,
      color1,
      color2,
      signature_url: signatureUrl,
      approved: false,
    })
    .select()
    .single();

  if (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Could not save message",
      },
      {
        status: 500,
      },
    );
  }

  // return Response.json({
  //   success: true,
  //   message,
  // });

  return Response.json({
    success: true,
    message: {
      id: message.id,
      sticker: message.sticker_name as StickerName,
      color1: message.color1,
      color2: message.color2,
      signature: message.signature_url,
    },
  });
}

export async function GET() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    // .eq("approved", true)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Could not fetch messages",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    success: true,
    messages: data.map<LeaveMessage>((message) => ({
      id: message.id,
      sticker: message.sticker_name as StickerName,
      color1: message.color1,
      color2: message.color2,
      signature: message.signature_url,
    })),
  });
}
