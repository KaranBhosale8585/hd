"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LogOut, Loader } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl flex items-center font-bold text-gray-800 hover:text-black transition"
        >
          <Loader className="inline-block text-blue-600 mr-2" />
          <p>Dashboard</p>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <button
          className="md:hidden flex gap-1 items-center rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
        >
            <LogOut size={16} />
            Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
