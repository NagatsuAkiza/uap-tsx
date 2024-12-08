// src/components/Filter.tsx
import { SearchIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

interface FilterProps {
  onFilter: (filters: { model: string; priceRange: { min: number; max: number } }) => void;
}

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

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [models, setModels] = useState<string[]>([]); // State untuk menyimpan model mobil
  const [minPriceFromDB, setMinPriceFromDB] = useState(0); // Minimum price dari database
  const [maxPriceFromDB, setMaxPriceFromDB] = useState(1000000); // Maximum price dari database

  useEffect(() => {
    const fetchCarsData = async () => {
      const response = await fetch("/api/cars?page=1"); // Ambil data mobil
      const data = await response.json();

      // Set model dari database dengan casting ke string[]
      const carModels = Array.from(
        new Set(data.cars.map((car: CarInterface) => car.model))
      ) as string[];
      setModels(carModels);

      // Set harga min dan max
      setMinPriceFromDB(data.minPrice);
      setMaxPriceFromDB(data.maxPrice);

      // Set nilai filter default
      setMinPrice(data.minPrice.toString());
      setMaxPrice(data.maxPrice.toString());
    };

    fetchCarsData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = {
      model,
      priceRange: {
        min: minPrice ? parseInt(minPrice) : minPriceFromDB,
        max: maxPrice ? parseInt(maxPrice) : maxPriceFromDB
      }
    };
    onFilter(filters); // Trigger filter function from parent
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Filter Mobil</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model:
          </label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Pilih model mobil</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
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
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={`Harga minimum ${minPriceFromDB}`}
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
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={`Harga maksimum ${maxPriceFromDB}`}
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
