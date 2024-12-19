import { getServerSession } from "next-auth";
import USidebar from "@/components/U-Sidebar";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="min-h-screen">
        <div>
          <USidebar />
        </div>
      </section>
    </main>
  );
}
