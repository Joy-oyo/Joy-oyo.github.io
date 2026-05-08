import { NextRequest, NextResponse } from "next/server";
import { verificationStore } from "@/lib/verificationStore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    const stored = verificationStore.get(email);
    if (!stored) {
      return NextResponse.json(
        { error: "No verification code found for this email" },
        { status: 400 }
      );
    }

    const tenMinutes = 10 * 60 * 1000;
    if (Date.now() - stored.timestamp > tenMinutes) {
      verificationStore.delete(email);
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    if (stored.attempts >= 5) {
      verificationStore.delete(email);
      return NextResponse.json(
        { error: "Too many attempts. Please request a new code." },
        { status: 400 }
      );
    }

    stored.attempts += 1;

    if (stored.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    verificationStore.delete(email);
    console.log(`Email verified successfully: ${email}`);
    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("verify-code error:", err);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
