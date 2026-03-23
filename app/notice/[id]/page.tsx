import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/auth";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { NoticeAdminActions } from "@/components/notice/NoticeAdminActions";

type Props = {
  params: Promise<{ id: string }>;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();

  const { data: notice } = await supabase
    .from("notices")
    .select("id, title, content, category, notice_date, thumbnail_image_url, created_at, updated_at")
    .eq("id", id)
    .single();

  if (!notice) notFound();

  const { data: files } = await supabase
    .from("notice_files")
    .select("id, file_name, file_url, file_type, file_size")
    .eq("notice_id", id)
    .order("created_at", { ascending: true });

  const displayDate = notice.notice_date
    ? new Date(notice.notice_date).toLocaleDateString("ko-KR")
    : new Date(notice.created_at).toLocaleDateString("ko-KR");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {notice.category && (
              <span className="inline-flex rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                {notice.category}
              </span>
            )}
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{notice.title}</h1>
          </div>
          <p className="shrink-0 text-sm text-slate-500">{displayDate}</p>
        </div>

        <div className="mb-10 border-t border-slate-700" aria-hidden />

        {notice.thumbnail_image_url && (
          <div className="mb-10 overflow-hidden rounded-lg">
            <Image
              src={notice.thumbnail_image_url}
              alt=""
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          </div>
        )}

        <div className="mb-12 max-w-none whitespace-pre-wrap leading-relaxed text-slate-300">
          {notice.content || ""}
        </div>

        {files && files.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-sm font-semibold text-slate-400">첨부파일</h2>
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.id}>
                  <a
                    href={f.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 hover:underline"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
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
                    <span>{f.file_name}</span>
                    {f.file_size != null && (
                      <span className="text-slate-500">({formatFileSize(f.file_size)})</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/notice"
            className="rounded-md border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            목록
          </Link>
          {isAdmin && <NoticeAdminActions noticeId={notice.id} />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
