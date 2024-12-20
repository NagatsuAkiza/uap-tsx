import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan untuk mengimpor Prisma client

export async function GET() {
  try {
    // Mengambil data transaksi beserta relasinya
    const transactions = await prisma.payment.findMany({
      include: {
        rental: {
          include: {
            user: true, // Menyertakan informasi pengguna
            car: true // Menyertakan informasi mobil
          }
        }
      }
    });

    // Mengembalikan response dengan data transaksi
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
    