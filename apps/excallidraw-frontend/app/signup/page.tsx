"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
    try {
      await axios.post(`${HTTP_BACKEND}/signup`, {
        name,
        email,
        password,
      });

      router.push("/signin");
    } catch (e) {
      alert("Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md p-8 border border-gray-800 rounded-2xl bg-black shadow-lg">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6">Start collaborating in seconds</p>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-white cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}