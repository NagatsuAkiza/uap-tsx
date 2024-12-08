import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CarDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CarDetailProps) {
  const { id } = await params;
  const carId = parseInt(id);
  const car = await prisma.car.findUnique({
    where: { id: carId }
  });

  return {
    title: car ? `${car.brand} ${car.model}` : "Mobil Tidak Ditemukan"
  };
}

export default async function CarDetailPage({ params }: CarDetailProps) {
  const { id } = await params;
  const carId = parseInt(id);
  const car = await prisma.car.findUnique({
    where: { id: carId }
  });

  if (!car) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      {/* Bagian Gambar dengan Overlay */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        <Image
          src={car.imageUrl || "https://via.placeholder.com/800x600"}
          alt={`${car.brand} ${car.model}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            {car.brand} {car.model}
          </h1>
        </div>
      </div>

      {/* Informasi Mobil */}
      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
        <p className="text-gray-600 mb-4">
          Harga per hari:{" "}
          <span className="font-semibold text-lg">Rp {car.pricePerDay.toLocaleString()}</span>
        </p>
        <p className="text-gray-600 mb-4">Deskripsi: {car.description}</p>
        <p className="text-gray-600 mb-4">Pemilik: {car.ownerName}</p>
        <p
          className={`text-lg font-semibold mb-6 ${
            car.availability ? "text-green-600" : "text-red-600"
          }`}>
          {car.availability ? "Tersedia untuk disewa" : "Tidak tersedia"}
        </p>

        {car.availability ? (
          <Link href={`/booking/${car.id}`}>
            <Button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Sewa Mobil
            </Button>
          </Link>
        ) : (
          <Button className="bg-gray-400 text-gray-200 py-2 px-4 rounded-md cursor-not-allowed">
            Tidak Tersedia
          </Button>
        )}
      </div>

      {/* Tombol Kembali */}
      <div className="mt-6 text-center">
        <Link href="/cars-list">
          <Button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Kembali ke Daftar Mobil
          </Button>
        </Link>
      </div>
    </div>
  );
}
