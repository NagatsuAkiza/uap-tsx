import React from "react";
import Link from "next/link";

const Navbar = () => {
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
            <li>
              <Link href="#home" className="hover:text-green-300 transition duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-green-300 transition duration-200">
                About
              </Link>
            </li>
            <li>
              <Link href="#services" className="hover:text-green-300 transition duration-200">
                Services
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-green-300 transition duration-200">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-green-300 transition duration-200">
                Book
              </Link>
            </li>
          </ul>
        </nav>

        {/* Login Button */}
        <div>
          <button className="bg-white text-green-600 font-bold px-4 py-2 rounded hover:bg-green-700 hover:text-white transition duration-200">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
