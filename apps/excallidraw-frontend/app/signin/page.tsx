"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignin() {
    try {
      const res = await axios.post("http://localhost:3001/signin", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/room");
    } catch (e) {
      alert("Signin failed");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md p-8 border border-gray-800 rounded-2xl bg-black shadow-lg">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-6">Login to continue drawing</p>

        {/* Input */}
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
          onClick={handleSignin}
          className="w-full py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
        >
          Sign In
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <span
            className="text-white cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}