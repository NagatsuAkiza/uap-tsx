"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface StatsData {
  totalCars: number;
  activeRentals: number;
  pendingPayments: number;
  penalties: number;
}

interface RentalData {
  id: number;
  car: string;
  renter: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface TransactionData {
  id: number;
  profilePicture: string;
  name: string;
  rentalStatus: string;
  paymentStatus: string;
  timeRemaining: string;
}

const DashboardComponent = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentRentals, setRecentRentals] = useState<RentalData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, rentalsRes, transactionsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/recent-rentals"),
          fetch("/api/dashboard/transactions")
        ]);

        if (!statsRes.ok || !rentalsRes.ok || !transactionsRes.ok) {
          throw new Error(
            `Failed to fetch: ${statsRes.status} / ${rentalsRes.status} / ${transactionsRes.status}`
          );
        }

        const statsData = await statsRes.json();
        const rentalsData = await rentalsRes.json();
        const transactionsData = await transactionsRes.json();

        if (!statsData || !rentalsData || !transactionsData) {
          throw new Error("Received invalid data from the API");
        }

        setStats(statsData);
        setRecentRentals(rentalsData);
        setTransactions(transactionsData);
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

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <h1>Error Loading Dashboard</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!stats || recentRentals.length === 0 || transactions.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-blue-700">Total Cars</h2>
          <p className="text-2xl font-bold text-blue-800">{stats.totalCars}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-green-700">Active Rentals</h2>
          <p className="text-2xl font-bold text-green-800">{stats.activeRentals}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-yellow-700">Pending Payments</h2>
          <p className="text-2xl font-bold text-yellow-800">{stats.pendingPayments}</p>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="text-lg font-semibold text-red-700">Penalties</h2>
          <p className="text-2xl font-bold text-red-800">{stats.penalties}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Recent Rentals</h2>
        <div className="overflow-auto bg-gray-50 rounded shadow">
          <table className="min-w-full bg-white rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Car</th>
                <th className="py-2 px-4 border-b text-left">Renter</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Start Date</th>
                <th className="py-2 px-4 border-b text-left">End Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="py-2 px-4 border-b">{rental.car}</td>
                  <td className="py-2 px-4 border-b">{rental.renter}</td>
                  <td className="py-2 px-4 border-b text-green-700">{rental.status}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(rental.startDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(rental.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Transactions Overview</h2>
        <div className="overflow-auto bg-gray-50 rounded shadow">
          <table className="min-w-full bg-white rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Profile</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Rental Status</th>
                <th className="py-2 px-4 border-b text-left">Payment Status</th>
                <th className="py-2 px-4 border-b text-left">Time Remaining</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b">
                    <Image
                      width={1000}
                      height={1000}
                      src={transaction.profilePicture}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.name}</td>
                  <td className="py-2 px-4 border-b text-green-700">{transaction.rentalStatus}</td>
                  <td className="py-2 px-4 border-b text-yellow-600">
                    {transaction.paymentStatus}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.timeRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
