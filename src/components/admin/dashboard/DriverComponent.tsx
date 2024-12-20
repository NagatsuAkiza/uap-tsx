"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

// Define the data structure for CarOwner data
interface CarOwnerData {
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

const CarOwnerPage = () => {
  const [ownerData, setOwnerData] = useState<CarOwnerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the car owner data from the API
  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await fetch("/api/cars/owners");

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: CarOwnerData[] = await response.json();
        setOwnerData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching data:", err);
          setError(err.message || "An unknown error occurred");
        } else {
          console.error("An unexpected error occurred", err);
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  // Function to format numbers as IDR (Indonesian Rupiah)
  const formatToIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(price);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h1>Error Loading Car Owner Data</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (ownerData.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Car Owner Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownerData.map((owner) => (
          <div
            key={owner.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <div className="relative w-full h-40 mb-4">
              <Image
                src={owner.imageUrl}
                alt={`${owner.carBrand} ${owner.carModel}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div
                className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                  owner.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}>
                {owner.availability ? "Available" : "Not Available"}
              </div>
            </div>
            {/* Content */}
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              {owner.carBrand} {owner.carModel}
            </h2>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{owner.description}</p>
            {/* Price and Owner */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-800 font-semibold">
                {formatToIDR(owner.pricePerDay)}{" "}
                <span className="text-sm text-gray-500">/ day</span>
              </p>
              <p className="text-sm text-gray-500">By: {owner.ownerName}</p>
            </div>
            {/* Rating */}
            <div className="flex items-center justify-center text-yellow-500">
              {owner.carRating !== null ? (
                <>
                  <span className="text-sm font-semibold">{owner.carRating}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.588 4.89a1 1 0 00.95.69h5.216c.969 0 1.372 1.24.588 1.81l-4.208 3.051a1 1 0 00-.364 1.118l1.588 4.89c.3.921-.755 1.688-1.539 1.118l-4.208-3.051a1 1 0 00-1.176 0l-4.208 3.051c-.784.57-1.839-.197-1.539-1.118l1.588-4.89a1 1 0 00-.364-1.118L2.44 10.316c-.784-.57-.38-1.81.588-1.81h5.216a1 1 0 00.95-.69l1.588-4.89z" />
                  </svg>
                </>
              ) : (
                <span className="text-sm text-gray-500">No rating</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarOwnerPage;
