"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

// Helper function untuk menghitung sisa waktu
const calculateRemainingTime = (endDate: string) => {
  const currentDate = new Date();
  const rentalEndDate = new Date(endDate);
  const timeDifference = rentalEndDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.floor(timeDifference / (1000 * 3600 * 24));

  return daysRemaining > 0 ? `${daysRemaining} days left` : "Expired";
};

// Helper function untuk menentukan warna status
const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Defining types for User, Rental, and Transaction
interface User {
  id: number;
  name: string;
  profilePicture: string;
}

interface Rental {
  user: User;
  status: string;
  endDate: string;
}

interface Transaction {
  id: number;
  rental: Rental;
  status: string;
}

const TransactionComponent = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transaction/info");
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-gray-500">No transactions found.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Current Rentals</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Profile</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Rental Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Payment Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Time Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Image
                    width={1000}
                    height={1000}
                    src={transaction.rental?.user?.profilePicture ?? "/default-profile.jpg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {transaction.rental?.user?.name ?? "N/A"}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(
                      transaction.rental?.status ?? ""
                    )}`}>
                    {transaction.rental?.status ?? "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(
                      transaction.status ?? ""
                    )}`}>
                    {transaction.status ?? "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {calculateRemainingTime(transaction.rental?.endDate ?? "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionComponent;
