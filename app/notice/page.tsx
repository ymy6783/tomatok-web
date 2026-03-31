import Link from "next/link";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { NOTICE_CATEGORIES, fetchNoticePage, type NoticeItem } from "@/lib/notices";

type SearchParams = { page?: string; category?: string };

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDisplayDate(notice: NoticeItem) {
  const source = notice.updatedAt || notice.createdAt;
  if (!source) return "-";
  return new Date(source).toLocaleDateString("ko-KR");
}

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requestedCategory = params.category ?? "";
  const category =
    NOTICE_CATEGORIES.find((value) => value === requestedCategory) ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const noticePage = await fetchNoticePage(page, category);
  const notices = noticePage.items;
  const currentPage = noticePage.page;
  const totalPages = noticePage.totalPages;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">공지사항</h1>
            <p className="mt-2 text-sm text-slate-400">
              {category ? `${category} 공지사항을 최신순으로 확인할 수 있습니다.` : "전체 공지사항을 최신순으로 확인할 수 있습니다."}
            </p>
          </div>
        </div>

        <nav className="mb-0 flex gap-8 border-b border-slate-700" aria-label="카테고리">
          {[{ value: "", label: "전체" }, ...NOTICE_CATEGORIES.map((value) => ({ value, label: value }))].map((item) => {
            const isActive = item.value === category;
            const href = item.value
              ? `/notice?${new URLSearchParams({ category: item.value, page: "1" }).toString()}`
              : "/notice";

            return (
              <Link
                key={item.label}
                href={href}
                className={`relative -mb-px border-b-2 pb-4 pt-2 text-sm font-medium transition ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-700">
          {!notices.length ? (
            <div className="py-20 text-center text-sm text-slate-500">
              등록된 공지사항이 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {notices.map((notice) => {
                return (
                  <li key={notice.id} className="transition hover:bg-slate-800/50">
                    <Link
                      href={`/notice/${notice.id}`}
                      className="flex items-center gap-4 px-1 py-5 sm:py-6"
                    >
                      <span className="w-20 shrink-0 text-left text-sm font-semibold text-cyan-400">
                        {notice.category}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="truncate font-semibold text-white">
                          {notice.title}
                        </span>
                        <span className="mt-1 block truncate text-sm text-slate-500">
                          {stripHtml(notice.bodyHtml) || "본문이 없습니다."}
                        </span>
                      </span>
                      <span className="w-24 shrink-0 text-right text-sm text-slate-500">
                        {formatDisplayDate(notice)}
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
              href={`/notice?${new URLSearchParams({ ...(category ? { category } : {}), page: String(Math.max(1, currentPage - 1)) }).toString()}`}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                currentPage <= 1
                  ? "cursor-not-allowed text-slate-600"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-disabled={currentPage <= 1}
            >
              &lt;
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/notice?${new URLSearchParams({ ...(category ? { category } : {}), page: String(p) }).toString()}`}
                className={`flex h-9 w-9 items-center justify-center rounded text-sm font-medium ${
                  p === currentPage ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={`/notice?${new URLSearchParams({ ...(category ? { category } : {}), page: String(Math.min(totalPages, currentPage + 1)) }).toString()}`}
              className={`flex h-9 w-9 items-center justify-center rounded text-sm ${
                currentPage >= totalPages
                  ? "cursor-not-allowed text-slate-600"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-disabled={currentPage >= totalPages}
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
