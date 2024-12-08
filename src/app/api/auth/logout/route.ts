import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  return response;
}
