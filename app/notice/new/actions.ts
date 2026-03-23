"use server";

import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BUCKET_THUMBNAILS = "notice-thumbnails";
const BUCKET_FILES = "notice-files";

function uniqueFileName(originalName: string): string {
  const safe = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100);
  const ext = safe.includes(".") ? safe.slice(safe.lastIndexOf(".")) : "";
  const base = safe.includes(".") ? safe.slice(0, safe.lastIndexOf(".")) : safe;
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${base}${ext}`;
}

export async function createNotice(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/notice");
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const noticeDate = (formData.get("notice_date") as string)?.trim();
  const isPinned = formData.get("is_pinned") === "on";

  if (!title) {
    return { error: "제목을 입력해 주세요." };
  }
  if (!category) {
    return { error: "카테고리를 선택해 주세요." };
  }

  const supabase = await createClient();

  let thumbnailUrl: string | null = null;
  const thumbnail = formData.get("thumbnail") as File | null;
  if (thumbnail?.size && thumbnail.size > 0) {
    const path = uniqueFileName(thumbnail.name);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_THUMBNAILS)
      .upload(path, thumbnail, {
        contentType: thumbnail.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return { error: `대표 이미지 업로드 실패: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_THUMBNAILS)
      .getPublicUrl(path);
    thumbnailUrl = urlData.publicUrl;
  }

  const { data: notice, error } = await supabase
    .from("notices")
    .insert({
      title,
      content: content || null,
      category: category || null,
      notice_date: noticeDate || null,
      thumbnail_image_url: thumbnailUrl,
      is_pinned: isPinned,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  const attachmentFiles = formData.getAll("attachments") as File[];
  for (const file of attachmentFiles) {
    if (!file?.size || file.size <= 0) continue;

    const path = uniqueFileName(file.name);
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_FILES)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_FILES)
      .getPublicUrl(path);

    await supabase.from("notice_files").insert({
      notice_id: notice.id,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_type: file.type || null,
      file_size: file.size,
    });
  }

  revalidatePath("/notice");
  redirect("/notice");
}
