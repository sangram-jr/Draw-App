"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

export default function RoomPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  async function handleCreateRoom() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { slug },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roomId = res.data.roomId;

      router.push(`/canvas/${roomId}`);
    } catch (e) {
      alert("Room creation failed");
    }
  }

  async function handleJoinRoom() {
    try {
      const res = await axios.get(
        `${HTTP_BACKEND}/room/${slug}`
      );

      const roomId = res.data.room.id;

      router.push(`/canvas/${roomId}`);
    } catch (e) {
      alert("Room not found");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-3xl font-bold mb-6">Create or Join Room</h1>

      <input
        type="text"
        placeholder="Enter room name"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="px-4 py-3 bg-black border border-gray-700 rounded-lg mb-6 w-80"
      />

      <div className="flex gap-4">
        <button
          onClick={handleCreateRoom}
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold"
        >
          Create Room
        </button>

        <button
          onClick={handleJoinRoom}
          className="px-6 py-3 border border-gray-600 rounded-lg"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}