"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "공지", label: "공지" },
  { value: "업데이트", label: "업데이트" },
  { value: "주주", label: "주주" },
] as const;

export function NoticeSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const q = (form.elements.namedItem("q") as HTMLInputElement)?.value ?? "";
      const category = (form.elements.namedItem("category") as HTMLSelectElement)?.value ?? "";
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      params.set("page", "1");
      router.push(`/notice?${params.toString()}`);
    },
    [router]
  );

  const currentCategory = searchParams.get("category") ?? "";
  const currentQ = searchParams.get("q") ?? "";

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        name="category"
        defaultValue={currentCategory}
        className="h-9 rounded-md border border-slate-600 bg-slate-900 px-3 text-sm text-slate-200 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value || "all"} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="search"
        name="q"
        defaultValue={currentQ}
        placeholder="공지사항 검색"
        className="h-9 min-w-[180px] rounded-md border border-slate-600 bg-slate-900 px-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:min-w-[220px]"
      />
      <button
        type="submit"
        className="h-9 rounded-md bg-white px-4 text-sm font-medium text-slate-950 hover:bg-slate-200"
      >
        검색
      </button>
    </form>
  );
}
