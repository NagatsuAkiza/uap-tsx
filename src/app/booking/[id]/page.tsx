import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import Image from "next/image";
import { notFound, redirect } from "next/navigation"; // Import redirect and notFound

export default async function BookingPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  // If the user is not logged in, redirect to the login page
  if (!session) {
    redirect("/auth/login");
  }

  const params = await props.params;
  const carId = parseInt(params.id);
  const car = await prisma.car.findUnique({
    where: { id: carId }
  });

  // If the car is not found, return a 404 page
  if (!car) {
    notFound(); // This will trigger the 404 page
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 1: Info Mobil */}
        <section className="col-span-1 bg-white p-4 shadow-md rounded-md">
          <Image
            width={1000}
            height={1000}
            src={car.imageUrl}
            alt={car.model}
            className="w-full h-64 object-cover mb-4 rounded-md"
          />
          <h2 className="text-2xl font-bold mb-2">
            {car.brand} {car.model}
          </h2>
          <p className="text-sm text-gray-500 mb-4">{car.description}</p>
          <p className="text-lg font-semibold text-blue-600">
            Rp {car.pricePerDay.toLocaleString()} / hari
          </p>
          <div className="mt-4">
            <p className="text-sm">
              <strong>Pemilik:</strong> {car.ownerName}
            </p>
            <p className="text-sm">
              <strong>Rating:</strong> {car.rating ? `${car.rating}/5` : "Belum ada rating"}
            </p>
          </div>
        </section>

        {/* Section 2: Form Booking */}
        <section className="col-span-2 bg-white p-6 shadow-md rounded-md">
          <BookingForm car={car} />
        </section>
      </div>
    </div>
  );
}
