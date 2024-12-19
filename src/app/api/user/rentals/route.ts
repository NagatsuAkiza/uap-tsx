// app/api/user/rentals/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Ambil sesi pengguna menggunakan NextAuth
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Konversi session.user.id ke angka
    const userId = Number(session.user.id);

    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Ambil data rental berdasarkan userId
    const rentals = await prisma.rental.findMany({
      where: { userId },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            pricePerDay: true,
            imageUrl: true,
            description: true,
            ownerName: true,
            no_telp: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            paymentDate: true
          }
        },
        penalties: {
          select: {
            id: true,
            type: true,
            amount: true,
            reason: true,
            createdAt: true
          }
        }
      }
    });

    // Format response
    const formattedRentals = rentals.map((rental) => ({
      rentalId: rental.id,
      startDate: rental.startDate,
      endDate: rental.endDate,
      status: rental.status,
      car: {
        id: rental.car.id,
        brand: rental.car.brand,
        model: rental.car.model,
        pricePerDay: rental.car.pricePerDay,
        imageUrl: rental.car.imageUrl,
        description: rental.car.description,
        ownerName: rental.car.ownerName,
        contact: rental.car.no_telp
      },
      payments: rental.payments.map((payment) => ({
        paymentId: payment.id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paymentDate: payment.paymentDate
      })),
      penalties: rental.penalties.map((penalty) => ({
        penaltyId: penalty.id,
        type: penalty.type,
        amount: penalty.amount,
        reason: penalty.reason,
        createdAt: penalty.createdAt
      }))
    }));

    return NextResponse.json({ rentals: formattedRentals });
  } catch (error) {
    console.error("Error fetching user rentals:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
