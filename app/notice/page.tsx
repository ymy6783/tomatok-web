import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function NoticePage() {
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

  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">공지사항</h1>

        {isAdmin && (
          <Link
            href="/notice/new"
            className="bg-black text-white px-4 py-2 rounded"
          >
            글쓰기
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {notices?.map((notice) => (
          <Link
            key={notice.id}
            href={`/notice/${notice.id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="font-semibold">{notice.title}</div>
            <div className="text-sm text-gray-500">
              {new Date(notice.created_at).toLocaleString()}
            </div>
          </Link>
        ))}

        {!notices?.length && (
          <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
        )}
      </div>
    </main>
  );
}