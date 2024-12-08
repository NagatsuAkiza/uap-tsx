import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="min-h-screen">
        <div>
          <Image
            src={"/images/sixt.png"}
            alt="bghero"
            className="w-full"
            width={1000}
            height={1000}
            priority
          />
        </div>
      </section>
    </main>
  );
}
