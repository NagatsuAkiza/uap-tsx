import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan Anda sudah mengatur Prisma Client di `lib/prisma.ts`

export async function GET() {
  try {
    // Mengambil statistik dari database
    const totalCars = await prisma.car.count();
    const activeRentals = await prisma.rental.count({
      where: { status: "APPROVED" }
    });
    const pendingPayments = await prisma.payment.count({
      where: { status: "PENDING" }
    });
    const penalties = await prisma.penalty.count();

    return NextResponse.json({
      totalCars,
      activeRentals,
      pendingPayments,
      penalties
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
