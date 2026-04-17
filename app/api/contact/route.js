function validateContact({ name, email, message }) {
  const errors = [];

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

const ipMap = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const record = ipMap.get(ip) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    record.count = 1;
    record.start = now;
    ipMap.set(ip, record);
    return false;
  }

  record.count += 1;
  ipMap.set(ip, record);

  return record.count > maxRequests;
}

function getIp(req) {
  const xfwd = req.headers.get("x-forwarded-for");

  if (xfwd) {
    return xfwd.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");

  if (realIp) return realIp;

  return "unknown";
}

async function verifyTurnstile(token, ip) {
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    },
  );

  return res.json();
}

export async function POST(req) {
  const body = await req.json();

  const token = body.token;

  console.log("token:", token);

  if (!token) {
    return Response.json(
      { success: false, error: "Missing token" },
      { status: 400 },
    );
  }

  const ip = getIp(req);

  const captchaResult = await verifyTurnstile(token, ip);

  if (!captchaResult.success) {
    return Response.json(
      { success: false, error: "Invalid captcha" },
      { status: 403 },
    );
  }

  if (rateLimit(ip)) {
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
    return Response.json({ success: false, errors }, { status: 400 });
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
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `Message from ${name}`,
      text: message,
      replyTo: email,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false }, { status: 500 });
  }
}
