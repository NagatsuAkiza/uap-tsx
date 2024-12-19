import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { carId, startDate, endDate, payment } = body;

    // Ambil session pengguna
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        { error: "Anda harus login untuk melakukan booking." },
        { status: 401 }
      );
    }

    // Convert userId ke number
    const userId = Number(user.user?.id);

    if (!userId) {
      return NextResponse.json({ error: "Data pengguna tidak valid." }, { status: 400 });
    }

    // Validasi input
    if (!carId || !startDate || !endDate || !payment?.amount || !payment?.method) {
      return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: "Tanggal mulai harus lebih kecil dari tanggal selesai." },
        { status: 400 }
      );
    }

    // Periksa ketersediaan mobil
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json({ error: "Mobil tidak ditemukan." }, { status: 404 });
    }

    if (!car.availability) {
      return NextResponse.json({ error: "Mobil tidak tersedia." }, { status: 400 });
    }

    // Mulai transaksi
    const rentalTransaction = await prisma.$transaction(async (prisma) => {
      // Tambahkan data rental
      const rental = await prisma.rental.create({
        data: {
          userId,
          carId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: "APPROVED"
        }
      });

      // Tambahkan data pembayaran
      const paymentRecord = await prisma.payment.create({
        data: {
          rentalId: rental.id,
          amount: payment.amount,
          method: payment.method.toUpperCase(),
          status: "PAID",
          paymentDate: new Date()
        }
      });

      // Perbarui status mobil
      await prisma.car.update({
        where: { id: carId },
        data: {
          availability: false,
          userId: userId
        }
      });

      return { rental, payment: paymentRecord };
    });

    return NextResponse.json({
      message: "Booking berhasil dibuat.",
      data: rentalTransaction
    });
  } catch (error: unknown) {
    console.error("Error during booking:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
