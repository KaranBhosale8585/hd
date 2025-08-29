import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { connectDB } from "@/lib/connectDB";
import { Note } from "@/models/Note";

export async function GET() {
  await connectDB();
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notes = await Note.find({ userId: user._id }).lean();
  return NextResponse.json({ user, notes });
}
