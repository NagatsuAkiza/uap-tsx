import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Validasi bahwa request memiliki body
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Body request tidak valid" }, { status: 400 });
    }

    const { email, password, name, noKtp, noHp } = body;

    // Validasi input
    if (!email || !password || !name || !noKtp || !noHp) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Validasi format email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan data user dan account ke database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        accounts: {
          create: {
            noHp,
            noKtp,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    // Response sukses
    return NextResponse.json({ message: "User berhasil dibuat", user: newUser }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
  }
}
  