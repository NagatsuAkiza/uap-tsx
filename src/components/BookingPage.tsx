export default function BookingPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Booking Page for Car ID: {params.id}</h1>
    </div>
  );
}
