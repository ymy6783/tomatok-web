import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/auth";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { NoticeSearchForm } from "@/components/notice/NoticeSearchForm";

const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "공지", label: "공지" },
  { value: "업데이트", label: "업데이트" },
  { value: "주주", label: "주주" },
] as const;

const ITEMS_PER_PAGE = 10;

type SearchParams = { category?: string; q?: string; page?: string };

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category ?? "";
  const q = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const supabase = await createClient();
  const isAdmin = await getIsAdmin();

  let query = supabase
    .from("notices")
    .select("id, title, category, notice_date, is_pinned, created_at", { count: "exact" });

  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data: notices, count } = await query
    .order("is_pinned", { ascending: false })
    .order("notice_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const noticeIds = (notices ?? []).map((n) => n.id);
  const { data: files } =
    noticeIds.length > 0
      ? await supabase
          .from("notice_files")
          .select("notice_id")
          .in("notice_id", noticeIds)
      : { data: [] };
  const hasFileSet = new Set((files ?? []).map((f) => f.notice_id));

  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">공지사항</h1>
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-md bg-slate-800" />}>
              <NoticeSearchForm />
            </Suspense>
            {isAdmin && (
              <Link
                href="/notice/new"
                className="shrink-0 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                글쓰기
              </Link>
            )}
          </div>
        </div>

        <nav className="mb-0 flex gap-8 border-b border-slate-700" aria-label="카테고리">
          {CATEGORIES.map((c) => {
            const isActive = !c.value ? !category : category === c.value;
            return (
              <Link
                key={c.value || "all"}
                href={
                  c.value
                    ? `/notice?category=${encodeURIComponent(c.value)}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                    : `/notice${q ? `?q=${encodeURIComponent(q)}` : ""}`
                }
                className={`relative -mb-px border-b-2 pb-4 pt-2 text-sm font-medium transition ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700">
          {!notices?.length ? (
            <div className="py-20 text-center text-sm text-slate-500">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {notices.map((notice) => {
                const isPinned = !!notice.is_pinned;
                const hasFile = hasFileSet.has(notice.id);

                return (
                  <li
                    key={notice.id}
                    className={`transition hover:bg-slate-800/50 ${isPinned ? "bg-slate-800/30" : ""}`}
                  >
                    <Link
                      href={`/notice/${notice.id}`}
                      className="flex items-center gap-4 px-1 py-5 sm:py-6"
                    >
                      <span
                        className={`w-20 shrink-0 text-left text-sm ${
                          isPinned ? "font-semibold text-cyan-400" : "text-slate-500"
                        }`}
                      >
                        {notice.category || "-"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`flex items-center gap-2 truncate ${
                            isPinned ? "font-semibold text-white" : "font-normal text-slate-200"
                          }`}
                        >
                          {isPinned && (
                            <svg
                              className="h-4 w-4 shrink-0 text-cyan-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v10l-5-4-5 4V5z" />
                            </svg>
                          )}
                          {hasFile && (
                            <svg
                              className="h-4 w-4 shrink-0 text-slate-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                          )}
                          {notice.title}
                        </span>
                      </span>
                      <span
                        className={`w-24 shrink-0 text-right text-sm ${
                          isPinned ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {notice.notice_date
                          ? new Date(notice.notice_date).toLocaleDateString("ko-KR")
                          : new Date(notice.created_at).toLocaleDateString("ko-KR")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="페이지네이션">
            <Link
              href={`/notice?${new URLSearchParams({ ...(category && { category }), ...(q && { q }), page: String(Math.max(1, page - 1)) }).toString()}`}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                page <= 1
                  ? "cursor-not-allowed text-slate-600"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-disabled={page <= 1}
            >
              &lt;
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/notice?${new URLSearchParams({ ...(category && { category }), ...(q && { q }), page: String(p) }).toString()}`}
                className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium ${
                  p === page ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/notice?${new URLSearchParams({ ...(category && { category }), ...(q && { q }), page: String(Math.min(totalPages, page + 1)) }).toString()}`}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                page >= totalPages
                  ? "cursor-not-allowed text-slate-600"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-disabled={page >= totalPages}
            >
              &gt;
            </Link>
          </nav>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
