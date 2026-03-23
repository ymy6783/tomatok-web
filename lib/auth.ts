import { createClient } from "@/lib/supabase/server";

export async function getIsAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user?.email) return false;

  const { data: admin } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email)
    .single();

  return !!admin;
}
