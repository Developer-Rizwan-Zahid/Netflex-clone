"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../services/api";
import { useRouter } from "next/navigation";

interface SignupForm {
  email: string;
  password: string;
}

export default function SignupPage() {
  const { register, handleSubmit } = useForm<SignupForm>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const onSubmit = async (data: SignupForm) => {
    try {
      await API.post("/auth/signup", data);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-10 rounded-lg flex flex-col gap-6 w-96"
      >
        <h1 className="text-2xl font-bold text-red-600 text-center">Signup</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
        <button
          type="submit"
          className="bg-red-600 py-2 rounded hover:bg-red-500"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

