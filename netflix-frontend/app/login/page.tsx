"use client";

import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await API.post("/auth/login", data);
      login(res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900 p-10 rounded-lg flex flex-col gap-6 w-96"
      >
        <h1 className="text-2xl font-bold text-red-600 text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
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
          Login
        </button>
      </form>
    </div>
  );
}
