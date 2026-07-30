"use client";

import { createStickerUrl } from "@/lib/createStickerUrl";
import { StickerName } from "@/lib/stickerMap";
import { useCallback, useEffect, useState } from "react";
import { LeaveMessage } from "@/lib/fetchMessages";
import { Check, X } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface MessagesResponse {
  success: boolean;
  messages: LeaveMessage[];
}

type Filter = "all" | "approved" | "pending";

export default function AdminPage() {
  const [messages, setMessages] = useState<LeaveMessage[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");

  const router = useRouter();

  async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    router.push("/admin/login");
    router.refresh();
  }

  const fetchMessages = async function (): Promise<MessagesResponse> {
    const res = await fetch("/api/admin/messages");

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    return res.json();
  };

  async function approveMessage(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
    });

    if (!res.ok) {
      console.error("Failed to approve");
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? {
              ...message,
              status: true,
            }
          : message,
      ),
    );
  }

  async function rejectMessage(id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Failed to reject");
      return;
    }

    setMessages((prev) => prev.filter((message) => message.id !== id));
  }

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetchMessages();
      setMessages(res.messages);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    //eslint-disable-next-line
    loadMessages();

    const channel = supabaseClient
      .channel("admin-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          loadMessages();
        },
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [loadMessages]);

  const filteredMessages = messages.filter((message) => {
    if (filter === "all") return true;

    if (filter === "approved") {
      return message.status;
    }
    return !message.status;
  });

  return (
    <main className="flex flex-col items-center justify-start w-full min-h-screen">
      <div className="flex flex-col gap-4 p-8 justify-center items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <h2 className="text-xl font-bold">Messages</h2>

        <div className="flex gap-4 ">
          <button
            onClick={() => setFilter("all")}
            className={`
            px-4 py-2 rounded-lg
            border
            transition-colors
            ${
              filter === "all"
                ? "bg-gray-200  font-bold "
                : "bg-gray-200  font-normal "
            }
          `}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`
            px-4 py-2 rounded-lg
            border
            transition-colors
            ${filter === "pending" ? " font-bold bg-gray-200" : "bg-gray-200 font-normal "}
          `}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("approved")}
            className={`
            px-4 py-2 rounded-lg
            border
            transition-colors
            ${
              filter === "approved"
                ? "bg-gray-200 font-bold"
                : "bg-gray-200 font-normal "
            }
         `}
          >
            Approved
          </button>
        </div>
      </div>

      <div
        className="
          w-full
          grid
          grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
          gap-4
          p-8
        "
      >
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="
              border-2 border-gray-500
              flex flex-col
              gap-4
              items-center
              p-4
              rounded-lg
            "
          >
            <div className="w-32 aspect-square flex justify-center items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={createStickerUrl(
                  message.sticker as StickerName,
                  message.color1,
                  message.color2,
                )}
                alt="sticker"
                className="w-32 h-32 object-contain"
              />
            </div>

            <div className="w-32 aspect-square flex justify-center items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.signature}
                alt="signature"
                className="w-32 h-32 object-contain"
              />
            </div>

            <p className="text-center font-semibold">
              Created at{" "}
              {message.created_at
                ? new Date(message.created_at).toLocaleString("el-GR", {
                    timeZone: "Europe/Athens",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown date"}
            </p>

            <p>{message.status ? "Approved" : "Pending approval"}</p>

            <div className="flex gap-4">
              <button
                className="
                  flex items-center justify-center
                  w-10 h-10
                  rounded-full
                  bg-green-100
                  text-green-600
                  hover:bg-green-200
                  transition-colors
                  cursor-pointer
                "
                title="Approve message"
                onClick={() => approveMessage(message.id)}
              >
                <Check size={22} strokeWidth={3} />
              </button>

              <button
                className="
                  flex items-center justify-center
                  w-10 h-10
                  rounded-full
                  bg-red-100
                  text-red-600
                  hover:bg-red-200
                  transition-colors
                  cursor-pointer
                "
                title="Reject message"
                onClick={() => rejectMessage(message.id)}
              >
                <X size={22} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={logout}
          className="
          px-4 py-2
          rounded-lg
          border
          bg-red-100
          hover:bg-red-200
          text-red-700
          cursor-pointer
          "
        >
          Logout
        </button>
      </div>
    </main>
  );
}
