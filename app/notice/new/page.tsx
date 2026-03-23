import Link from "next/link";
import { redirect } from "next/navigation";
import { getIsAdmin } from "@/lib/auth";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { NoticeForm } from "@/components/notice/NoticeForm";

export default async function NewNoticePage() {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/notice");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">공지사항 작성</h1>
          <Link
            href="/notice"
            className="text-sm text-slate-400 hover:text-white"
          >
            목록으로
          </Link>
        </div>

        <NoticeForm />
      </main>

      <SiteFooter />
    </div>
  );
}
