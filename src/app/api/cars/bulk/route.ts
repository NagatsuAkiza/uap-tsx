import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { cars } = await req.json();

    if (!Array.isArray(cars) || cars.length === 0) {
      return NextResponse.json({ message: "Cars array is required" }, { status: 400 });
    }

    const createdCars = await prisma.car.createMany({
      data: cars.map((car) => ({
        brand: car.brand,
        model: car.model,
        pricePerDay: car.pricePerDay,
        availability: car.availability,
        imageUrl: car.imageUrl,
        description: car.description,
        ownerName: car.ownerName,
        no_telp: car.no_telp,
        rating: car.rating || null,
        userId: null
      })),
      skipDuplicates: true // Hindari duplikasi
    });

    return NextResponse.json(
      { message: "Cars added successfully", count: createdCars.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding cars:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
