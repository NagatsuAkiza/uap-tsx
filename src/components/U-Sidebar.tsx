"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import DashboardComponent from "@/components/user/dashboard/DashboardComponent";
import CarsList from "@/components/user/dashboard/CarsList";
import BookingComponent from "@/components/admin/dashboard/BookingComponent";

interface SidebarItem {
  name: string;
  id: string;
  section?: "main" | "report";
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", id: "dashboard", section: "main" },
  { name: "Car List", id: "carlist", section: "main" },
  { name: "Booking", id: "booking", section: "main" }
];

const USidebar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleComponentChange = (id: string) => {
    setActiveComponent(id);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-16"
        } h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 text-center bg-gray-900 font-bold text-lg">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none">
            {isSidebarOpen ? "PT. Bendi Car" : "B"}
          </button>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul>
            {sidebarItems
              .filter((item) => item.section === "main")
              .map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer px-4 py-2 rounded mb-2 ${
                    activeComponent === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleComponentChange(item.id)}>
                  {isSidebarOpen ? item.name : item.name[0]}
                </li>
              ))}
          </ul>
          <hr className="my-4 border-gray-600" />
          <ul>
            {sidebarItems
              .filter((item) => item.section === "report")
              .map((item) => (
                <li
                  key={item.id}
                  className={`cursor-pointer px-4 py-2 rounded mb-2 ${
                    activeComponent === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                  onClick={() => handleComponentChange(item.id)}>
                  {isSidebarOpen ? item.name : item.name[0]}
                </li>
              ))}
          </ul>
        </nav>
        <div className="p-4">
          <button
            className="w-full px-4 py-2 font-bold text-left text-red-500 hover:text-red-500 hover:bg-gray-700 rounded"
            onClick={handleLogout}>
            {isSidebarOpen ? "Log out" : "X"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-100 overflow-auto">
        <div className="p-4 bg-white rounded-lg shadow-md">
          {activeComponent === "dashboard" && <DashboardComponent />}
          {activeComponent === "carlist" && <CarsList />}
          {activeComponent === "booking" && <BookingComponent />}
        </div>
      </div>
    </div>
  );
};

export default USidebar;
