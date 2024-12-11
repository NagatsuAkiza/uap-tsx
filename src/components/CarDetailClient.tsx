"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Rating } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl: string;
  description: string;
  ownerName: string;
  rating: number | null;
}

export const CarDetailClient = ({ car }: { car: Car }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    if ((car && car.rating) || (car && car.pricePerDay)) {
      setRating(car.rating);
      setPrice(car.pricePerDay);
    }
  }, [car]);

  const handleRent = () => {
    if (car.availability) {
      // Logika untuk pemesanan
      alert(`Berhasil menyewa mobil: ${car.brand} ${car.model}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
        <Image
          src={car.imageUrl || "https://via.placeholder.com/800x600"}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover rounded-lg"
          width={800}
          height={800}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            {car.brand} {car.model}
          </h1>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <p className="text-gray-700 text-lg">
            <span className="font-bold">Harga per hari:</span>{" "}
            <span className="text-indigo-600 font-semibold text-xl">
              Rp {price?.toLocaleString()}
            </span>
          </p>
          <p
            className={`text-lg font-semibold ${
              car.availability ? "text-green-600" : "text-red-600"
            }`}>
            {car.availability ? "Tersedia untuk disewa" : "Tidak tersedia"}
          </p>
        </div>
        <div className="text-gray-600 space-y-4">
          <p>
            <span className="font-semibold text-gray-800">Deskripsi:</span> {car.description}
          </p>
          <p>
            <span className="font-semibold text-gray-800">Pemilik:</span> {car.ownerName}
          </p>
        </div>

        {/* Rating */}
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">Rating Mobil:</p>
          <div className="flex items-center gap-2">
            <Rating
              name="car-rating"
              value={rating || 0}
              precision={0.5}
              size="large"
              readOnly
              sx={{ color: "#ffd700" }}
            />
            <span className="text-sm text-gray-500">
              {rating ? `${rating.toFixed(1)} / 5` : "Belum ada rating"}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
        <Link href={`/booking/${car.id}`}>
          <Button
            className={`bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition w-full md:w-auto ${
              car.availability ? "" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleRent}
            disabled={!car.availability}>
            {car.availability ? "Sewa Sekarang" : "Tidak Tersedia"}
          </Button>
        </Link>
        <Link href="/cars-list">
          <Button className="bg-gray-200 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-300 transition w-full md:w-auto">
            Kembali ke Daftar Mobil
          </Button>
        </Link>
      </div>
    </div>
  );
};
