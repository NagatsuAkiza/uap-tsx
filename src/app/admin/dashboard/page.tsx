"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

interface UserDashboard {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (!session || !session.user) {
        router.push("/auth/login");
      } else if (session.user.role === "USER") {
        router.push("/dashboard");
      } else {
        setUser({
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role || "ADMIN"
        });
      }

      setLoading(false);
    };

    fetchSession();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      ) : (
        <p>No user data found</p>
      )}
    </div>
  );
};

export default Dashboard;
