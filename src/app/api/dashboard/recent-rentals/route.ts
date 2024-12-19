import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan Anda sudah mengatur Prisma Client di `lib/prisma.ts`

export async function GET() {
  try {
    // Mengambil penyewaan terbaru dari database
    const recentRentals = await prisma.rental.findMany({
      take: 5,
      orderBy: { startDate: "desc" },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        car: {
          select: {
            brand: true,
            model: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Memformat hasil data
    const formattedRentals = recentRentals.map((rental) => ({
      id: rental.id,
      car: `${rental.car.brand} ${rental.car.model}`,
      renter: rental.user.name,
      status: rental.status,
      startDate: rental.startDate,
      endDate: rental.endDate
    }));

    return NextResponse.json(formattedRentals);
  } catch (error) {
    console.error("Error fetching recent rentals:", error);
    return NextResponse.json({ error: "Failed to fetch recent rentals" }, { status: 500 });
  }
}
