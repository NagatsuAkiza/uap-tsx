"use client";

import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <header className="bg-green-600 py-4">
      <div className="mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          <h2>Bendi Car</h2>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6 text-white font-medium">
            <Link href="/" className="hover:text-green-300 transition duration-200">
              Home
            </Link>
            <Link href="/cars-list" className="hover:text-green-300 transition duration-200">
              Cars
            </Link>
            <Link href="/book" className="hover:text-green-300 transition duration-200">
              Booking
            </Link>
          </ul>
        </nav>

        {/* Login/Logout Button */}
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-white text-green-600 font-bold px-4 py-2 rounded hover:bg-green-700 hover:text-white transition duration-200">
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="bg-white text-green-600 font-bold px-4 py-2 rounded hover:bg-green-700 hover:text-white transition duration-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
