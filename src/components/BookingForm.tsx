"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingFormProps {
  car: {
    id: number;
    brand: string;
    model: string;
    pricePerDay: number;
    availability: boolean;
    imageUrl: string;
    description: string;
    ownerName: string;
    rating: number | null;
  };
}

export default function BookingForm({ car }: BookingFormProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("EWALLET");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  // Calculate total amount whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (totalDays > 0) {
        setTotalAmount(totalDays * car.pricePerDay);
      } else {
        setTotalAmount(0); // Reset amount if invalid dates
      }
    }
  }, [startDate, endDate, car.pricePerDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate that start date is less than end date
    if (start >= end) {
      alert("Tanggal selesai harus lebih besar dari tanggal mulai.");
      return;
    }

    // Check that all necessary fields are filled
    if (!car.id || !startDate || !endDate || !totalAmount || !paymentMethod) {
      alert("Semua kolom harus diisi.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      carId: car.id,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      payment: {
        amount: totalAmount,
        method: paymentMethod
      }
    };

    try {
      console.log("Payload being sent:", payload); // Log payload to verify

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pemesanan berhasil!");
        router.push("/");
      } else {
        alert(data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      alert("Gagal menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Formulir Booking & Pembayaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {car.brand} {car.model}
          </h2>
          <p className="text-sm text-gray-600">{car.description}</p>
          <p className="text-sm text-gray-700 mt-2">
            <strong>Harga:</strong> {formatCurrency(car.pricePerDay)} / hari
          </p>
          <p className="text-sm text-gray-700">
            <strong>Pemilik:</strong> {car.ownerName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Rating:</strong> {car.rating ? `${car.rating}/5` : "Belum ada rating"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-2"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Tanggal Selesai
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-2"
              required
              min={startDate}
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Metode Pembayaran
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-2">
              <option value="BANK">Transfer Bank</option>
              <option value="EWALLET">E-Wallet</option>
            </select>
          </div>

          <div>
            <p className="text-md font-medium text-gray-800">
              Total Pembayaran: <span className="font-bold">{formatCurrency(totalAmount)}</span>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isSubmitting || totalAmount === 0}>
            {isSubmitting ? "Memproses..." : "Booking dan Bayar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
