"use client";

import React, { useEffect, useState } from "react";
import Filter from "@/components/Filter";
import CarCard from "@/components/CarCard";

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl: string;
  description: string;
  ownerName: string;
  rating: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Filters {
  brand?: string;
  priceRange?: PriceRange;
  rating?: number;
}

const CarsList: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async (page: number = 1, filters: Filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        brand: filters.brand || "",
        minPrice: filters.priceRange?.min?.toString() || "0",
        maxPrice: filters.priceRange?.max?.toString() || "1000000",
        rating: filters.rating?.toString() || "0"
      });

      const response = await fetch(`/api/cars?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch cars data");

      const data = await response.json();
      setFilteredCars(data.cars);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCars(page);
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  const applyFilter = (filters: { brand: string; priceRange: { min: number; max: number } }) => {
    fetchCars(currentPage, filters);
  };

  return (
    <div className="container mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-6">Daftar Mobil</h1>
      <Filter onFilter={applyFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id}>
              <CarCard car={car} />
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Tidak ada mobil yang tersedia dengan filter saat ini.
          </p>
        )}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
          Prev
        </button>
        <span className="mx-4 text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default CarsList;
