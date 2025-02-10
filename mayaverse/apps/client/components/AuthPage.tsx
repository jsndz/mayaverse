"use client";

import { useState } from "react";
import axios from "axios";

const SERVER_URL =
  process.env.NEXT_PUBLIC_STATE == "development"
    ? process.env.NEXT_PUBLIC_DEV_URL
    : process.env.NEXT_PUBLIC_PROD_URL;

interface SigninResponse {
  token: string;
}

interface ErrorResponse {
  message?: string;
}

export default function AuthForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!username) {
      setMessage("Username cannot be empty");
      return;
    }

    try {
      if (isSigningUp) {
        await axios.post(`${SERVER_URL}/api/v1/signup`, {
          username,
          password,
          type: "admin",
        });
        setMessage("Signup successful! You can now sign in.");
      } else {
        const response = await axios.post<SigninResponse>(
          `${SERVER_URL}/api/v1/signin`,
          {
            username,
            password,
          }
        );
        setMessage(`Signin successful! Token: ${response.data.token}`);
        localStorage.setItem("token", response.data.token);
      }
    } catch (error: any) {
      if (error.response) {
        const errorData: ErrorResponse = error.response.data;
        setMessage(errorData.message || `Error: ${error.response.status}`);
      } else {
        setMessage("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        {isSigningUp ? "Sign Up" : "Sign In"}
      </h2>
      {message && <p className="text-red-500 mb-3">{message}</p>}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isSigningUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
        onClick={() => setIsSigningUp(!isSigningUp)}
        className="mt-3 text-blue-500 underline"
      >
        {isSigningUp ? "Already have an account? Sign In" : "New here? Sign Up"}
      </button>
    </div>
  );
}
