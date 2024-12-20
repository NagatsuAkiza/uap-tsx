import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "json2csv";
export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        car: {
          select: {
            brand: true,
            model: true,
            pricePerDay: true
          }
        },
        payments: {
          select: {
            status: true,
            amount: true,
            paymentDate: true
          }
        }
      }
    });

    // Transformasi data untuk format laporan
    const reportData = rentals.map((rental) => ({
      userName: rental.user.name,
      userEmail: rental.user.email,
      car: `${rental.car.brand} ${rental.car.model}`,
      carPricePerDay: rental.car.pricePerDay,
      rentalStartDate: rental.startDate.toLocaleDateString(),
      rentalEndDate: rental.endDate.toLocaleDateString(),
      rentalStatus: rental.status,
      paymentStatus: rental.payments.length > 0 ? rental.payments[0].status : "Not Paid",
      paymentAmount: rental.payments.length > 0 ? rental.payments[0].amount : 0,
      paymentDate:
        rental.payments.length > 0
          ? rental.payments[0].paymentDate.toLocaleDateString()
          : "Not Paid"
    }));

    // Mengonversi data menjadi format CSV
    const csvData = parse(reportData);

    // Menyediakan CSV sebagai file untuk diunduh
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=rentals_report.csv"
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.error();
  }
}
