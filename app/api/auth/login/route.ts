import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/connectDB";
import { otpStore } from "@/utils/otpStore";
import { sendOtp } from "@/utils/sendOtp";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    const existingRecord = otpStore.get(email);
    if (existingRecord && Date.now() - existingRecord.timestamp < 1000 * 60) {
      return NextResponse.json(
        { error: "OTP already sent. Please wait for 60 seconds." },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOtp(email, existingUser.name, otp);
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      expires: Date.now() + 10 * 60 * 1000,
    });

    return NextResponse.json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
