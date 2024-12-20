import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const userId = Number(session?.user.id);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: {
        id: userId
      },
      include: {
        user: true // Include related user information if needed
      }
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Respond with the account data
    return NextResponse.json(account);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching profile data" },
      { status: 500 }
    );
  }
}
