"use client";
import Header from "@/components/Header";
import { use, useEffect, useState } from "react";

const page = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white px-4 py-10 text-black">
          {loading ? (
           <div>Loading...</div>
         ) : user ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Welcome, {user.name} 👋</h2>
            <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
          </div>
        ) : (
          <div>Please log in.</div>
        )}
      </main>
    </>
  );
};

export default page;
