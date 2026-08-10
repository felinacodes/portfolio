import { NextRequest } from "next/server";
import { supabase } from "@/lib/server/supabase";
import { requireAuth } from "@/lib/server/requireAdmin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();

  if (!user) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await params;

  const { error } = await supabase
    .from("messages")
    .update({
      approved: true,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to approve message:", error);

    return Response.json(
      {
        success: false,
        error: "Could not approve message",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    success: true,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();

  if (!user) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await params;

  const { data: message, error: fetchError } = await supabase
    .from("messages")
    .select("signature_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Failed to find message for deletion:", fetchError);

    return Response.json(
      {
        success: false,
        error: "Could not find message",
      },
      { status: 500 },
    );
  }

  const fileName = message.signature_url?.split("/").pop();

  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from("Portfolio - Signatures")
      .remove([fileName]);

    if (storageError) {
      console.error("Failed to delete signature:", storageError);

      return Response.json(
        {
          success: false,
          error: "Could not delete signature",
        },
        { status: 500 },
      );
    }
  }

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete message:", error);

    return Response.json(
      {
        success: false,
        error: "Could not delete message",
      },
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
  });
}
