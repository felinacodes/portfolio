import { NextRequest } from "next/server";

export function getIp(req: NextRequest) {
  const xfwd = req.headers.get("x-forwarded-for");

  if (xfwd) {
    return xfwd.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || "unknown";
}
