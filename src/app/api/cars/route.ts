// API handler untuk mendapatkan data mobil
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pageParam = req.nextUrl.searchParams.get("page") || "1";
  const pageSize = 9;
  const pageNumber = parseInt(pageParam);

  try {
    const cars = await prisma.car.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    });

    const minPrice = await prisma.car.aggregate({
      _min: {
        pricePerDay: true
      }
    });

    const maxPrice = await prisma.car.aggregate({
      _max: {
        pricePerDay: true
      }
    });

    const totalCars = await prisma.car.count();
    const totalPages = Math.ceil(totalCars / pageSize);

    const carsResponse = cars.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      pricePerDay: car.pricePerDay,
      imageUrl: car.imageUrl || "https://via.placeholder.com/150x250",
      description: car.description,
      availability: car.availability,
      ownerName: car.ownerName,
      carRating: car.rating
    }));

    return NextResponse.json({
      cars: carsResponse,
      totalPages,
      minPrice: minPrice._min.pricePerDay || 0,
      maxPrice: maxPrice._max.pricePerDay || 1000000
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars data" }, { status: 500 });
  }
}
