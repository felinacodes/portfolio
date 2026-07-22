import { NextRequest } from "next/server";
import { getIp } from "@/lib/server/getIp";
import { rateLimit } from "@/lib/server/rateLimit";

interface ContactData {
  name: string;
  email: string;
  message: string;
}

function validateContact({ name, email, message }: ContactData) {
  const errors: string[] = [];

  if (!name || name.length < 3) {
    errors.push("Name too short");
  }

  if (name.length > 100) {
    errors.push("Name too long");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email");
  }

  if (email.length > 100) {
    errors.push("Email too long");
  }

  if (!message || message.length < 5) {
    errors.push("Message too short");
  }

  if (message.length > 5000) {
    errors.push("Message too long");
  }

  return errors;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const ip = getIp(req);

  if (
    rateLimit({
      key: "contact",
      ip,
      maxRequests: 5,
      windowMs: 60 * 1000,
    })
  ) {
    return Response.json(
      { success: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  if (body.companyNumber) {
    return Response.json({ success: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const message = String(body.message || "").trim();

  const errors = validateContact({ name, email, message });

  if (errors.length) {
    return Response.json(
      {
        success: false,
        error: errors.join(", "),
      },
      { status: 400 },
    );
  }

  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `New message from ${name}`,
      text: `From: ${name} (${email})\n\n${message}`,
      replyTo: email,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      {
        success: false,
        // error: err instanceof Error ? err.message : "Something went wrong",
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
