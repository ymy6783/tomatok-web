"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createNotice } from "@/app/notice/new/actions";

const CATEGORIES = [
  { value: "", label: "선택" },
  { value: "공지", label: "공지" },
  { value: "업데이트", label: "업데이트" },
  { value: "주주", label: "주주" },
] as const;

export function NoticeForm() {
  const [state, formAction, isPending] = useActionState(createNotice, null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-8">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-400">
          제목 <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          disabled={isPending}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="notice_date" className="mb-1.5 block text-sm font-medium text-slate-400">
          공지일자
        </label>
        <input
          id="notice_date"
          name="notice_date"
          type="date"
          defaultValue={today}
          disabled={isPending}
          className="w-full max-w-[240px] rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 [color-scheme:dark] focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-400">
          카테고리 <span className="text-red-400">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          disabled={isPending}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value || "none"} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="is_pinned"
          name="is_pinned"
          type="checkbox"
          disabled={isPending}
          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 disabled:opacity-50"
        />
        <label htmlFor="is_pinned" className="text-sm text-slate-300">
          상단 고정
        </label>
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-slate-400">
          본문
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          disabled={isPending}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          placeholder="본문을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="thumbnail" className="mb-1.5 block text-sm font-medium text-slate-400">
          대표 이미지
        </label>
        <input
          id="thumbnail"
          name="thumbnail"
          type="file"
          accept="image/*"
          disabled={isPending}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="attachments" className="mb-1.5 block text-sm font-medium text-slate-400">
          첨부파일
        </label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          multiple
          disabled={isPending}
          className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-3 text-slate-300 file:mr-4 file:rounded file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-950/50 px-4 py-3 text-sm text-red-400">{state.error}</p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-8">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-white px-6 py-2.5 text-sm font-medium text-slate-950 hover:bg-slate-200 disabled:opacity-50"
        >
          {isPending ? "등록 중…" : "등록"}
        </button>
        <Link
          href="/notice"
          className={`rounded-md border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white ${isPending ? "pointer-events-none opacity-50" : ""}`}
        >
          취소
        </Link>
      </div>
    </form>
  );
}
