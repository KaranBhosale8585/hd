import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { otpStore } from "@/utils/otpStore";
import { connectDB } from "@/lib/connectDB";
import { generateToken } from "@/utils/token";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, otp, name} = await req.json();

  if (!otp || !email) {
    return NextResponse.json(
      { error: "Missing otp, email or name" },
      { status: 400 }
    );
  }

  const existingRecord = otpStore.get(email)
  if (!existingRecord) {
    return NextResponse.json({ error: "OTP not found" }, { status: 400 });
  }

  if (existingRecord.otp !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (Date.now() > existingRecord.expires) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }
  try {
    await connectDB();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
      otpStore.delete(email);
    }
    const token = await generateToken(user);

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: "Logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
