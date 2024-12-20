import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan Anda sudah mengonfigurasi Prisma Client

// Helper untuk menghitung waktu tersisa
const getTimeRemaining = (endDate: Date) => {
  const now = new Date();
  const timeDiff = endDate.getTime() - now.getTime();
  if (timeDiff <= 0) return "Expired";

  const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24));
  return `${daysRemaining} days remaining`;
};

export async function GET() {
  try {
    // Mengambil data transaksi rental aktif dari Prisma
    const transactions = await prisma.rental.findMany({
      where: {
        status: {
          in: ["PENDING", "APPROVED"] // hanya transaksi yang sedang berlangsung
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            accounts: {
              select: {
                fpUser: true // Foto profil pengguna
              }
            }
          }
        },
        car: {
          select: {
            brand: true,
            model: true,
            imageUrl: true // Gambar mobil
          }
        },
        payments: {
          select: {
            status: true // Status pembayaran
          }
        }
      }
    });

    // Transform data untuk menambahkan informasi waktu yang tersisa
    const formattedTransactions = transactions.map((transaction) => {
      const timeRemaining = getTimeRemaining(new Date(transaction.endDate));

      return {
        id: transaction.id,
        profilePicture:
          transaction.user.accounts[0]?.fpUser ||
          "https://www.inforwaves.com/media/2021/04/dummy-profile-pic-300x300-1.png", // Foto profil default jika tidak ada
        name: transaction.user.name,
        rentalStatus: transaction.status,
        paymentStatus: transaction.payments[0]?.status || "Not Paid", // Status pembayaran, jika ada
        timeRemaining,
        car: `${transaction.car.brand} ${transaction.car.model}`,
        carImage: transaction.car.imageUrl
      };
    });

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.error();
  }
}
