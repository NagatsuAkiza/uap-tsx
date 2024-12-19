// app/api/cars/owners/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure Prisma is set up

interface CarResponse {
  id: number;
  carBrand: string;
  carModel: string;
  pricePerDay: number;
  imageUrl: string;
  description: string;
  availability: boolean;
  ownerName: string;
  carRating: number | null;
}

export async function GET() {
  try {
    const ownersData = await prisma.car.findMany({
      select: {
        id: true,
        brand: true,
        model: true,
        pricePerDay: true,
        imageUrl: true,
        description: true,
        availability: true,
        ownerName: true,
        rating: true // Rating field for carRating
      }
    });

    // Map the data to match the expected response structure
    const formattedData: CarResponse[] = ownersData.map((car) => ({
      id: car.id,
      carBrand: car.brand,
      carModel: car.model,
      pricePerDay: car.pricePerDay,
      imageUrl: car.imageUrl,
      description: car.description,
      availability: car.availability,
      ownerName: car.ownerName,
      carRating: car.rating // Ensure this is properly mapped
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
