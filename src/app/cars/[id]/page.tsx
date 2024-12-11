import { notFound } from "next/navigation";
import { CarDetailClient } from "@/components/CarDetailClient";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const cars = await prisma.car.findMany({
    select: {
      id: true
    }
  });

  return cars.map((car) => ({
    id: car.id.toString()
  }));
}

export default async function CarDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const carId = await parseInt(params.id);
  const car = await prisma.car.findUnique({
    where: { id: carId }
  });

  if (!car) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <CarDetailClient car={car} />
    </div>
  );
}
