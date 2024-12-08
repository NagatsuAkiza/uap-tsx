"use client";

import React, { useEffect, useState } from "react";
import Filter from "@/components/Filter";
import CarCard from "@/components/CarCard";

interface CarInterface {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl: string;
  description: string;
  ownerName: string;
}

const CarsList: React.FC = () => {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async (page: number = 1) => {
    const response = await fetch(`/api/cars?page=${page}`);
    const data = await response.json();
    setCars(data.cars);
    setFilteredCars(data.cars);
    setTotalPages(data.totalPages);
  };

  const applyFilter = (filters: { model: string; priceRange: { min: number; max: number } }) => {
    const { model, priceRange } = filters;
    const filtered = cars.filter((car) => {
      const matchesModel = car.model.toLowerCase().includes(model.toLowerCase());
      const matchesPrice = car.pricePerDay >= priceRange.min && car.pricePerDay <= priceRange.max;
      return matchesModel && matchesPrice;
    });
    setFilteredCars(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCars(page);
  };

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 mt-6">
      <h1 className="text-3xl font-bold mb-6">Daftar Mobil</h1>
      <Filter onFilter={applyFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id}>
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
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
