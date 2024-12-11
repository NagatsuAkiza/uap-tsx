import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CarResponse {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  imageUrl: string;
  description: string;
  availability: boolean;
  ownerName: string;
  carRating: number | null;
}

// Update CarsAPIResponse untuk menyertakan 'brands'
interface CarsAPIResponse {
  cars: CarResponse[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  minPrice: number;
  maxPrice: number;
  brands: string[]; // Tambahkan field brands
}

export async function GET(req: NextRequest) {
  const pageParam = req.nextUrl.searchParams.get("page") || "1";
  const pageSize = 9;
  const pageNumber = Math.max(1, parseInt(pageParam) || 1);

  const minPrice = req.nextUrl.searchParams.get("minPrice") || "0";
  const maxPrice = req.nextUrl.searchParams.get("maxPrice") || "300000";
  const brand = req.nextUrl.searchParams.get("brand") || "";

  const priceRange = {
    min: parseInt(minPrice),
    max: parseInt(maxPrice)
  };

  const filterConditions: Record<string, unknown> = {
    pricePerDay: {
      gte: priceRange.min,
      lte: priceRange.max
    }
  };

  if (brand && brand !== "") {
    filterConditions.brand = brand;
  }

  try {
    const cars = await prisma.car.findMany({
      where: filterConditions,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize
    });

    const priceAggregation = await prisma.car.aggregate({
      _min: { pricePerDay: true },
      _max: { pricePerDay: true }
    });

    const minPriceFromDB = priceAggregation._min.pricePerDay ?? 0;
    const maxPriceFromDB = priceAggregation._max.pricePerDay ?? 1000000;

    const totalCars = await prisma.car.count({
      where: filterConditions
    });
    const totalPages = Math.ceil(totalCars / pageSize) || 1;

    const carBrands = await prisma.car.findMany({
      select: { brand: true },
      distinct: ["brand"] // Mengambil brand yang unik
    });
    const uniqueBrands = carBrands.map((car) => car.brand);

    const carsResponse: CarResponse[] = cars.map((car) => ({
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

    return NextResponse.json<CarsAPIResponse>({
      cars: carsResponse,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      minPrice: minPriceFromDB,
      maxPrice: maxPriceFromDB,
      brands: uniqueBrands // Kirimkan daftar brand unik ke frontend
    });
  } catch (error) {
    console.error("Error fetching cars data:", error);
    return NextResponse.json({ error: "Failed to fetch cars data" }, { status: 500 });
  }
}
