"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LogOut, Loader, X, Menu } from "lucide-react";

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
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-black transition"
        >
          Tasks
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
          className="md:hidden block px-3 py-2 rounded-md text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} />
            Logout
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
