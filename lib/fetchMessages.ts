export interface LeaveMessage {
  id: string;
  sticker: string;
  color1: string;
  color2: string;
  signature: string;
}

interface MessagesResponse {
  success: boolean;
  messages: LeaveMessage[];
}

export async function fetchMessages(): Promise<MessagesResponse> {
  const res = await fetch("/api/messages");

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
}
