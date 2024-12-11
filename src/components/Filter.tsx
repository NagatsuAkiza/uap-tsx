"use client";

import { SearchIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface FilterProps {
  onFilter: (filters: { brand: string; priceRange: { min: number; max: number } }) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [minPriceFromDB, setMinPriceFromDB] = useState(0);
  const [maxPriceFromDB, setMaxPriceFromDB] = useState(1000000);

  useEffect(() => {
    const fetchCarsData = async () => {
      const response = await fetch("/api/cars?page=1"); // Ambil data mobil pertama
      const data = await response.json();

      const carBrands = data.brands || []; // Ambil daftar brand yang dikirim oleh backend
      setBrands(carBrands);

      setMinPriceFromDB(data.minPrice);
      setMaxPriceFromDB(data.maxPrice);
    };

    fetchCarsData();
  }, []);

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = {
      brand,
      priceRange: {
        min: minPrice ? parseInt(minPrice) : minPriceFromDB,
        max: maxPrice ? parseInt(maxPrice) : maxPriceFromDB
      }
    };
    onFilter(filters); // Trigger filter function dari parent
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Filter Mobil</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand:
          </label>
          <select
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Pilih brand mobil</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Harga Min:
          </label>
          <input
            id="minPrice"
            type="number"
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={`Harga minimum ${formatCurrency(minPriceFromDB)}`}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Harga Max:
          </label>
          <input
            id="maxPrice"
            type="number"
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={`Harga maksimum ${formatCurrency(maxPriceFromDB)}`}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition flex flex-row gap-2 justify-center items-center">
          Cari <SearchIcon size={20} />
        </button>
      </form>
    </div>
  );
};

export default Filter;
