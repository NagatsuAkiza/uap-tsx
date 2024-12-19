// app/api/user/info/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Retrieve the session using NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Convert session.user.id to a number (matches your schema)
    const userId = Number(session.user.id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user info from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        accounts: {
          select: {
            noHp: true,
            noKtp: true,
            alamat: true,
            fKtp: true,
            fpUser: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user information
    return NextResponse.json({
      name: user.name,
      email: user.email,
      accountInfo: user.accounts.map((account) => ({
        noHp: account.noHp,
        noKtp: account.noKtp,
        alamat: account.alamat,
        fKtp: account.fKtp,
        fpUser: account.fpUser
      }))
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
