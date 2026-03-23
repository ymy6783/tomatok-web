"use client";

import Link from "next/link";
import { deleteNotice } from "@/app/notice/[id]/actions";

type NoticeAdminActionsProps = {
  noticeId: string;
};

export function NoticeAdminActions({ noticeId }: NoticeAdminActionsProps) {
  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Link
        href={`/notice/${noticeId}/edit`}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
      >
        수정
      </Link>
      <form action={deleteNotice.bind(null, noticeId)} className="inline" onSubmit={handleDelete}>
        <button
          type="submit"
          className="rounded-md border border-red-800/50 bg-transparent px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/50"
        >
          삭제
        </button>
      </form>
    </>
  );
}
