"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, getSession } from "next-auth/react";
import DashboardComponent from "@/components/admin/dashboard/DashboardComponent";
import DriverComponent from "@/components/admin/dashboard/DriverComponent";
import PaymentComponent from "@/components/admin/dashboard/PaymentComponent";
import TransactionComponent from "@/components/admin/dashboard/TransactionComponent";
import CarReportComponent from "@/components/admin/dashboard/CarReportComponent";
import SessionWrapper from "@/components/SessionWrapper";

interface SidebarItem {
  name: string;
  id: string;
  section?: "main" | "report";
}

interface UserDashboard {
  id: string;
  name: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", id: "dashboard", section: "main" },
  { name: "Driver", id: "driver", section: "main" },
  { name: "Payment Detail", id: "payment-detail", section: "report" },
  { name: "Transactions", id: "transactions", section: "report" },
  { name: "Car Report", id: "car-report", section: "report" }
];

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<UserDashboard | null>(null);
  const [activeComponent, setActiveComponent] = useState<string>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const route = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (!session || !session.user) {
        route.push("/auth/login");
      }
      setUser({
        id: session?.user.id as string,
        name: session?.user.name || ""
      });
    };

    fetchSession();
  }, [route]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const handleComponentChange = (id: string) => {
    setActiveComponent(id);
  };

  return (
    <SessionWrapper>
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
          <div className="p-4 text-center">
            {isSidebarOpen && user?.name && (
              <div className="mb-4">
                <h3 className="font-bold text-white text-lg">{user.name}</h3>
              </div>
            )}
            <button
              className="w-full px-4 py-2 font-bold text-center text-red-500 hover:text-red-500 hover:bg-gray-700 rounded"
              onClick={handleLogout}>
              {isSidebarOpen ? "Log out" : "X"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 bg-gray-100 overflow-auto">
          <div className="p-4 bg-white rounded-lg shadow-md">
            {activeComponent === "dashboard" && <DashboardComponent />}
            {activeComponent === "driver" && <DriverComponent />}
            {activeComponent === "payment-detail" && <PaymentComponent />}
            {activeComponent === "transactions" && <TransactionComponent />}
            {activeComponent === "car-report" && <CarReportComponent />}
          </div>
        </div>
      </div>
    </SessionWrapper>
  );
};

export default Sidebar;
