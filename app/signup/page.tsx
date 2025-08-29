"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Mail, User } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const sendOtp = async () => {
    if (!form.name || !form.email) {
      setMsg("All fields are required.");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message || data.error || "Unexpected response.");

      if (res.ok) {
        if (data.userExists) {
          setMsg("Account already exists. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 2000);
        } else {
          setStep("otp");
        }
      }
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setMsg("Please enter a valid 4-digit OTP.");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp, name: form.name }),
      });

      const data = await res.json();
      setMsg(data.message || data.error || "Unexpected response.");

      if (res.ok) {
        router.replace("/");
      }
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white text-black relative">
      {/* Branding */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 flex items-center gap-2 text-2xl sm:text-3xl font-bold">
        <Loader className="text-blue-600 size-6 sm:size-7" />
        <span className="text-black italic">HD</span>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-10 md:py-0">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-center mb-2">
            Create Account
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            {step === "form"
              ? "Sign up with your email."
              : `OTP has been sent to ${form.email}`}
          </p>

          {/* Name */}
          <label className="block text-sm mb-1 font-medium">Name</label>
          <div className="relative mb-4">
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={step === "otp"}
            />
          </div>

          {/* Email */}
          <label className="block text-sm mb-1 font-medium">Email</label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={step === "otp"}
            />
          </div>

          {/* OTP Section */}
          {step === "otp" && (
            <>
              <label className="block text-sm mb-1 font-medium mt-2">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={loading}
              />

              <button
                onClick={sendOtp}
                className="text-sm text-blue-600 hover:underline mb-4"
                disabled={loading}
              >
                Resend OTP
              </button>
            </>
          )}

          {/* Submit Button */}
          <button
            onClick={step === "form" ? sendOtp : verifyOtp}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:cursor-pointer transition disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? step === "form"
                ? "Sending OTP..."
                : "Verifying..."
              : step === "form"
              ? "Get OTP"
              : "Verify OTP"}
          </button>

          {/* Message */}
          {msg && (
            <p
              className={`mt-4 text-center text-sm ${
                msg.toLowerCase().includes("error") ||
                msg.toLowerCase().includes("fail") ||
                msg.toLowerCase().includes("wrong")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {msg}
            </p>
          )}

          {/* Login link */}
          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 underline hover:text-black"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/Illustration.png"
          alt="Signup Illustration"
          className="w-full h-screen object-cover rounded-l-lg"
        />
      </div>
    </div>
  );
}
