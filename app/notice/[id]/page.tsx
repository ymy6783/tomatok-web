import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  let isAdmin = false;

  if (user?.email) {
    const { data: admin } = await supabase
      .from("admins")
      .select("email")
      .eq("email", user.email)
      .single();

    isAdmin = !!admin;
  }

  const { data: notice } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .single();

  if (!notice) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-6">
        <Link href="/notice" className="text-sm text-gray-500">
          ← 목록으로
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-3">{notice.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {new Date(notice.created_at).toLocaleString()}
      </p>

      {notice.image_url && (
        <img
          src={notice.image_url}
          alt={notice.title}
          className="w-full rounded mb-8"
        />
      )}

      <div className="whitespace-pre-wrap leading-7 mb-8">{notice.content}</div>

      {isAdmin && (
        <div className="flex gap-3">
          <Link
            href={`/notice/${notice.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            수정
          </Link>

          <button className="bg-red-600 text-white px-4 py-2 rounded">
            삭제
          </button>
        </div>
      )}
    </main>
  );
}