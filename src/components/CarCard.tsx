import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  availability: boolean;
  imageUrl: string;
  description: string;
  ownerName: string;
}

const CarCard = ({ car }: { car: Car }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
      <Image
        src={car.imageUrl || "https://via.placeholder.com/150x250"}
        alt={car.model}
        className="w-full h-52 object-cover"
        width={800}
        height={800}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-600 mb-1">Rp {car.pricePerDay.toLocaleString()} / hari</p>
        <p className="text-sm text-gray-500 mb-2">{car.description}</p>
        <p className="text-sm text-gray-500 mb-2">Pemilik: {car.ownerName || "Unknown"}</p>
        <p
          className={`text-sm font-medium mb-4 ${
            car.availability ? "text-green-600" : "text-red-600"
          }`}>
          {car.availability ? "Tersedia" : "Tidak Tersedia"}
        </p>

        <div className="flex gap-2">
          <Link href={`/booking/${car.id}`}>
            <Button
              className={`py-2 px-4 w-full rounded-md ${
                car.availability
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
              disabled={!car.availability}>
              Sewa Mobil
            </Button>
          </Link>
          <Link href={`/cars/${car.id}`}>
            <Button className="py-2 px-4 w-full bg-blue-500 text-white hover:bg-blue-600">
              Detail
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
