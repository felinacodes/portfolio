import type { StickerName } from "@/lib/stickerMap";
import { LeaveMessage } from "@/lib/fetchMessages";
import { requireAuth } from "@/lib/server/requireAdmin";
import { supabase } from "@/lib/server/supabase";

export async function GET() {
  const user = await requireAuth();

  if (!user) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to fetch admin messages:", error);

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
      created_at: message.created_at,
      status: message.approved,
    })),
  });
}
