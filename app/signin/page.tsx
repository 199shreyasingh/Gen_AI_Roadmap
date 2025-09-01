"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [step, setStep] = useState<"email" | "otp" | "name">("email");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOrPhone) return;
    alert("Your OTP is: 1234");
    setStep("otp");
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp === "1234") {
      setStep("name");
    } else {
      alert("Invalid OTP, try 1234");
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    localStorage.setItem("userName", name);
    router.push("/");
  }

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="text-black min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>
            <input
              type="text"
              placeholder="Enter phone or email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="text-black w-full border rounded-lg p-3"
              minLength={10}
              required
            />
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
            >
              Get OTP
            </button>
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full text-sky-600 border border-sky-600 py-2 rounded-lg hover:bg-sky-50"
            >
              Back to Home
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter 1234"
              value={otp}
              required
              minLength={4}
              maxLength={4}
              onChange={(e) => setOtp(e.target.value)}
              className="text-black w-full border rounded-lg p-3"
            />
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full text-sky-600 border border-sky-600 py-2 rounded-lg hover:bg-sky-50"
            >
              Back to Home
            </button>
          </form>
        )}

        {step === "name" && (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Enter Your Name</h2>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              required
              minLength={2}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              className="text-black w-full border rounded-lg p-3"
            />
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full text-sky-600 border border-sky-600 py-2 rounded-lg hover:bg-sky-50"
            >
              Back to Home
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
