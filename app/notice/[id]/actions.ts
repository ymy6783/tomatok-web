"use server";

import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteNotice(id: string) {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    throw new Error("권한이 없습니다.");
  }

  const supabase = await createClient();

  await supabase.from("notice_files").delete().eq("notice_id", id);
  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/notice");
  redirect("/notice");
}
