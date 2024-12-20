"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

interface AccountData {
  alamat: string;
  noKtp: string;
  noHp: string;
  fKtp: string;
  fpUser: string;
}

const ProfileComponent = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("/api/account/profile");
        if (!response.ok) {
          throw new Error(`Error fetching account data: ${response.status}`);
        }
        const data: AccountData = await response.json();
        setAccountData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching data:", err);
          setError(err.message || "An unknown error occurred");
        } else {
          console.error("An unexpected error occurred", err);
          setError("An unknown error occurred");
        }
      }
    };

    fetchAccountData();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!accountData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <Image
            width={1000}
            height={1000}
            src={accountData.fpUser}
            alt="Profile Picture"
            className="w-40 h-40 border rounded-full object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase">Address</h2>
            <p className="text-lg text-gray-800">{accountData.alamat}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase">Phone Number</h2>
            <p className="text-lg text-gray-800">{accountData.noHp}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase">ID Number</h2>
            <p className="text-lg text-gray-800">{accountData.noKtp}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-600 uppercase">ID Card</h2>
            <Image
              width={1000}
              height={1000}
              src={accountData.fKtp}
              alt="ID Card"
              className="w-full max-w-sm border rounded shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
