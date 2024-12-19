// app/pages/car-owners.tsx

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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Car Owner Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ownerData.map((owner) => (
          <div key={owner.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-blue-700">
              {owner.carBrand} {owner.carModel}
            </h2>
            <Image
              src={owner.imageUrl}
              alt={`${owner.carBrand} ${owner.carModel}`}
              width={300}
              height={200}
              className="object-cover rounded-lg mb-4"
            />
            <p className="text-lg mb-2">
              <strong>Owner Name:</strong> {owner.ownerName}
            </p>
            <p className="text-lg mb-2">
              <strong>Price per Day:</strong> {formatToIDR(owner.pricePerDay)}
            </p>
            <p className="text-lg mb-2">
              <strong>Description:</strong> {owner.description}
            </p>
            <p className="text-lg mb-2">
              <strong>Availability:</strong> {owner.availability ? "Available" : "Not Available"}
            </p>
            <p className="text-lg mb-2">
              <strong>Rating:</strong> {owner.carRating !== null ? owner.carRating : "No rating"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarOwnerPage;
