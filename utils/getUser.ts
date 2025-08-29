import { cookies } from "next/headers";
import { connectDB } from "@/lib/connectDB";
import { verifyToken } from "./token";
import User from "@/models/User";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;


  try {
    const payload = await verifyToken(token);
    await connectDB();
    const user = await User.findOne({ eamil: payload?.email });
    if (!user) return null;
    return user;
  } catch (error) {
    console.log("Invalid or expired token:", error);
    return null;
  }

}
