"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus("error");
        setMessage(error.message || "로그인에 실패했습니다.");
        return;
      }
      window.location.href = "/notice";
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/50 p-8">
        <h1 className="mb-6 text-xl font-bold text-white">로그인</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={status === "loading"}
            className="w-full rounded-md border border-slate-600 bg-slate-950 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-md bg-white py-3 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:opacity-50"
          >
            {status === "loading" ? "로그인 중…" : "로그인"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-red-400">{message}</p>
        )}

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-slate-400 hover:text-white"
        >
          메인으로
        </Link>
      </div>
    </div>
  );
}
