"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/*Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight">
          DrawTogether
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/signin")}
            className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 text-sm bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/*Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-4">

        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Collaborate & Draw <br />
          <span className="text-gray-400">in Real-Time</span>
        </h1>

        <p className="text-gray-500 max-w-xl mb-10 text-lg">
          Create rooms, sketch ideas, and collaborate instantly with your team.
          A simple Excalidraw-style experience built for speed and clarity.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/room")}
            className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-gray-800 transition cursor-pointer"
          >
            Join Room
          </button>
        </div>
      </div>

      {/*Footer */}
      <div className="text-center text-gray-600 text-sm pb-6">
        Built by Sangram 
      </div>
    </div>
  );
}
