"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("로그인 실패");
    } else {
      alert("이메일 확인하세요!");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>

        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mb-4 w-64"
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white px-4 py-2 rounded"
        >
          이메일 로그인
        </button>
      </div>
    </main>
  );
}