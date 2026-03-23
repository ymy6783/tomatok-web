# 공지사항 글쓰기 페이지 설정 가이드

## 1. notices 테이블 SQL

```sql
-- notices 테이블
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  category text,
  notice_date date,
  is_pinned boolean default false,
  thumbnail_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 정책 (필요 시)
alter table public.notices enable row level security;

-- 공개 읽기 (모든 사용자)
create policy "notices_select" on public.notices
  for select using (true);

-- 관리자만 쓰기 (admins 테이블 email 기반)
create policy "notices_insert_admin" on public.notices
  for insert with check (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

create policy "notices_update_admin" on public.notices
  for update using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

create policy "notices_delete_admin" on public.notices
  for delete using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );
```

## 2. notice_files 테이블 SQL

```sql
-- notice_files 테이블
create table if not exists public.notice_files (
  id uuid primary key default gen_random_uuid(),
  notice_id uuid not null references public.notices(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text,
  file_size bigint,
  created_at timestamptz default now()
);

-- 인덱스
create index if not exists notice_files_notice_id_idx on public.notice_files(notice_id);

-- RLS 정책 (필요 시)
alter table public.notice_files enable row level security;

create policy "notice_files_select" on public.notice_files
  for select using (true);

create policy "notice_files_insert_admin" on public.notice_files
  for insert with check (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );

create policy "notice_files_delete_admin" on public.notice_files
  for delete using (
    exists (
      select 1 from public.admins
      where admins.email = auth.jwt() ->> 'email'
    )
  );
```

## 3. Storage 버킷 생성 가이드

Supabase Dashboard → Storage → New bucket 에서 생성합니다.

### notice-thumbnails 버킷

1. **Name**: `notice-thumbnails`
2. **Public bucket**: 체크 (썸네일 공개 URL 사용)
3. **File size limit**: 필요한 경우 설정 (예: 5MB)
4. **Allowed MIME types**: `image/*` (선택)

**RLS 정책 (Storage)**  
Storage → Policies에서:

```sql
-- 공개 읽기
create policy "notice-thumbnails_select"
on storage.objects for select
using (bucket_id = 'notice-thumbnails');

-- 인증된 관리자만 업로드
create policy "notice-thumbnails_insert_admin"
on storage.objects for insert
with check (
  bucket_id = 'notice-thumbnails'
  and exists (
    select 1 from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);
```

### notice-files 버킷

1. **Name**: `notice-files`
2. **Public bucket**: 체크 (첨부파일 다운로드 URL 공개)
3. **File size limit**: 필요한 경우 설정 (예: 20MB)

**RLS 정책 (Storage)**:

```sql
create policy "notice-files_select"
on storage.objects for select
using (bucket_id = 'notice-files');

create policy "notice-files_insert_admin"
on storage.objects for insert
with check (
  bucket_id = 'notice-files'
  and exists (
    select 1 from public.admins
    where admins.email = auth.jwt() ->> 'email'
  )
);
```

## 4. 전제 조건 체크리스트

| 항목 | 확인 |
|------|------|
| `admins` 테이블 존재, `email` 컬럼으로 관리자 판별 | ☐ |
| `notices` 테이블 생성 완료 | ☐ |
| `notice_files` 테이블 생성 완료 | ☐ |
| `notice-thumbnails` Storage 버킷 생성 및 Public 설정 | ☐ |
| `notice-files` Storage 버킷 생성 및 Public 설정 | ☐ |
| Storage RLS 정책 설정 (관리자 업로드 허용) | ☐ |
| `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 | ☐ |
| 관리자 이메일을 `admins` 테이블에 등록 | ☐ |
| Supabase Auth에 해당 관리자 사용자 생성 (이메일+비밀번호) | ☐ |
| `middleware.ts` matcher에 `/notice` 경로 포함 | ☐ |

## 5. 페이지 동작 흐름

```
/notice/new 접근
  → page.tsx: getIsAdmin() 호출
  → admins 테이블에 이메일 없으면 /notice 리다이렉트
  → 관리자면 NoticeForm 렌더링

폼 제출
  → createNotice 서버 액션 실행
  → 대표 이미지 있으면 notice-thumbnails 업로드
  → notices 테이블 insert
  → 첨부파일 있으면 notice-files 업로드 후 notice_files insert
  → 성공 시 /notice 리다이렉트
```
