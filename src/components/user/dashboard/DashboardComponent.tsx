"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Rental {
  rentalId: number;
  startDate: string;
  endDate: string;
  status: string;
  car: {
    id: number;
    brand: string;
    model: string;
    pricePerDay: number;
    imageUrl: string;
    description: string;
    ownerName: string;
    contact: string;
  };
  payments: {
    paymentId: number;
    amount: number;
    method: string;
    status: string;
    paymentDate: string;
  }[];
  penalties: {
    penaltyId: number;
    type: string;
    amount: number;
    reason: string;
    createdAt: string;
  }[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(amount);

const UserDashboardComponent = () => {
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch("/api/user/rentals");

        if (!response.ok) {
          throw new Error(`Failed to fetch rentals: ${response.status}`);
        }

        const data = await response.json();

        // Validasi apakah rentals adalah array
        if (Array.isArray(data.rentals)) {
          setMyRentals(data.rentals);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h1>Error Loading Rentals</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (myRentals.length === 0) {
    return <div>No rentals found.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Rentals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {myRentals.map((rental) => (
          <div key={rental.rentalId} className="bg-white p-4 rounded shadow">
            <Image
              width={1000}
              height={1000}
              src={rental.car.imageUrl}
              alt={`${rental.car.brand} ${rental.car.model}`}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-lg font-bold mt-2">{`${rental.car.brand} ${rental.car.model}`}</h2>
            <p className="text-gray-600">Price/Day: {formatCurrency(rental.car.pricePerDay)}</p>
            <p className="text-gray-600">
              Start Date: {new Date(rental.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              End Date: {new Date(rental.endDate).toLocaleDateString()}
            </p>
            <p
              className={`font-semibold ${
                rental.status === "APPROVED"
                  ? "text-green-500"
                  : rental.status === "PENDING"
                  ? "text-yellow-500"
                  : rental.status === "CANCELED"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}>
              Status: {rental.status}
            </p>
            <div className="mt-2">
              <h3 className="font-bold text-gray-700">Payments</h3>
              {rental.payments.map((payment) => (
                <div key={payment.paymentId} className="text-sm text-gray-600">
                  <p>Amount: {formatCurrency(payment.amount)}</p>
                  <p>Method: {payment.method}</p>
                  <p>Status: {payment.status}</p>
                  <p>Payment Date: {new Date(payment.paymentDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <h3 className="font-bold text-gray-700">Penalties</h3>
              {rental.penalties.map((penalty) => (
                <div key={penalty.penaltyId} className="text-sm text-gray-600">
                  <p>Type: {penalty.type}</p>
                  <p>Amount: {formatCurrency(penalty.amount)}</p>
                  <p>Reason: {penalty.reason}</p>
                  <p>Issued On: {new Date(penalty.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboardComponent;
