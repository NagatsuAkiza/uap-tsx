// app/payments/page.tsx
"use client";

import React, { useEffect, useState } from "react";

// Helper function untuk format tanggal
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));
};

// Helper function untuk format mata uang IDR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(amount);
};

// Helper function untuk menentukan warna status
const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-200 text-green-800";
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "CANCELED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

// Define interface for the payment data
interface PaymentProps {
  id: string;
  rentalId: string;
  amount: number;
  method: string; // Assuming method is a string (e.g., "Credit Card", "Bank Transfer")
  status: string; // Assuming status is an enum like "PAID", "PENDING", "CANCELED"
  paymentDate: string; // Payment date as string (ISO format)
  rental: {
    car: {
      brand: string;
      model: string;
      pricePerDay: number;
      rating: number;
    };
    user: {
      name: string;
      email: string;
      noHp: string;
    };
    startDate: string;
    endDate: string;
    status: string;
  };
}

const PaymentComponent = () => {
  const [payments, setPayments] = useState<PaymentProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const response = await fetch("/api/payment/info");
      const data = await response.json();
      setPayments(data);
      setLoading(false);
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg font-semibold text-gray-500">No payments found.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">Payment Details</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-transform transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-700">User Information</h3>
              <p className="text-gray-600 text-sm">Name: {payment.rental.user.name}</p>
              <p className="text-gray-600 text-sm">Email: {payment.rental.user.email}</p>
              <p className="text-gray-600 text-sm">Phone: {payment.rental.user.noHp}</p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Car Information</h3>
              <p className="text-gray-600 text-sm">Brand: {payment.rental.car.brand}</p>
              <p className="text-gray-600 text-sm">Model: {payment.rental.car.model}</p>
              <p className="text-gray-600 text-sm">
                Price per Day: {formatCurrency(payment.rental.car.pricePerDay)}
              </p>
              <p className="text-gray-600 text-sm">Rating: {payment.rental.car.rating}</p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Rental Information</h3>
              <p className="text-gray-600 text-sm">
                Start Date: {formatDate(payment.rental.startDate)}
              </p>
              <p className="text-gray-600 text-sm">
                End Date: {formatDate(payment.rental.endDate)}
              </p>
              <p className="text-gray-600 text-sm">Rental Status: {payment.rental.status}</p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">Payment Information</h3>
              <p
                className={`inline-block px-3 py-1 text-xs rounded-full ${getStatusColor(
                  payment.status
                )}`}>
                {payment.status}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Total Amount: {formatCurrency(payment.amount)}
              </p>
              <p className="text-gray-600 text-sm">Payment Method: {payment.method}</p>
              <p className="text-gray-600 text-sm">
                Payment Date: {formatDate(payment.paymentDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentComponent;
