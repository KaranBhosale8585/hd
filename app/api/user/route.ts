import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { connectDB } from "@/lib/connectDB";

export async function GET() {
  await connectDB();
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(user);
}

