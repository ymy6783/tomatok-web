import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/50 p-8">
        <h1 className="mb-6 text-xl font-bold text-white">로그인</h1>
        <p className="text-sm leading-relaxed text-slate-400">
          현재 웹 서비스에서는 별도의 관리자 로그인 기능을 제공하지 않습니다.
        </p>

        <Link
          href="/notice"
          className="mt-6 block text-center text-sm text-slate-400 hover:text-white"
        >
          공지사항으로
        </Link>
      </div>
    </div>
  );
}
