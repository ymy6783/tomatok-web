import { createClient } from "@supabase/supabase-js";

/**
 * 서버 API 전용. RLS를 우회하므로 반드시 Route Handler 등 서버에서만 사용하고,
 * 클라이언트/브라우저로 키가 노출되면 안 됩니다.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL 및 SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다."
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
