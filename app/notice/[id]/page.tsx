import Link from "next/link";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { fetchNoticeById } from "@/lib/notices";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = await fetchNoticeById(id);

  if (!notice) notFound();
  const displayDate = new Date(notice.updatedAt || notice.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              {notice.category}
            </span>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{notice.title}</h1>
          </div>
          <p className="shrink-0 text-sm text-slate-500">{displayDate}</p>
        </div>

        <div className="mb-10 border-t border-slate-700" aria-hidden />

        <div
          className="mb-12 max-w-none prose prose-invert prose-slate !text-slate-300"
          dangerouslySetInnerHTML={{ __html: notice.bodyHtml || "<p>본문이 없습니다.</p>" }}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/notice"
            className="rounded-md border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            목록
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
