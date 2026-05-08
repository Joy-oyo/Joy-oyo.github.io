import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verificationStore } from "@/lib/verificationStore";

export const runtime = "nodejs";

function emailTemplate(code: string) {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#333">
  <div style="max-width:600px;margin:0 auto;padding:20px">
    <div style="background:#002FA7;color:#fff;padding:20px;text-align:center">
      <h1 style="margin:0">Joy Chen Portfolio</h1>
    </div>
    <div style="padding:20px;background:#f9f9f9">
      <h2>Email Verification</h2>
      <p>Thanks for subscribing. Use this code to confirm your email:</p>
      <div style="font-size:24px;font-weight:bold;color:#002FA7;text-align:center;padding:20px;background:#fff;border-radius:10px;margin:20px 0">${code}</div>
      <p>This code expires in 10 minutes.</p>
    </div>
    <div style="text-align:center;padding:20px;color:#666">— Joy Chen</div>
  </div></body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationStore.set(email, {
      code,
      timestamp: Date.now(),
      attempts: 0,
    });

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      // Dev fallback: log code to server console
      console.log(`[DEV] Verification code for ${email}: ${code}`);
      return NextResponse.json({
        success: true,
        dev: true,
        message:
          "EMAIL_USER / EMAIL_PASS not set. Code logged to server console.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: user,
      to: email,
      subject: "Email Verification — Joy Chen Portfolio",
      html: emailTemplate(code),
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
    });
  } catch (err) {
    console.error("send-verification error:", err);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
