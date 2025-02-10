"use client";

import { useState } from "react";
import axios from "axios";
const SERVER_URL =
  process.env.NEXT_PUBLIC_STATE == "development"
    ? process.env.NEXT_PUBLIC_DEV_URL
    : process.env.NEXT_PUBLIC_PROD_URL;

interface SigninResponse {
  message: string;
  id: string;
}

interface ErrorResponse {
  message?: string;
}
const AdminAvatarPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleCreateAvatar = async () => {
    if (!imageUrl || !name) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post<SigninResponse>(
        `${SERVER_URL}/api/v1/admin/avatar`,
        { imageUrl, name },
        { headers: { authorization: `Bearer ${token}` } }
      );
      setMessage(`Avatar created successfully! ID: ${res.data.id}`);
    } catch (error) {
      setMessage("Error creating avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create New Avatar</h2>
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Avatar Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleCreateAvatar}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {loading ? "Creating..." : "Create Avatar"}
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default AdminAvatarPage;
