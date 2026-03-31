const DEFAULT_NOTICES_API_URL = "https://ec2.tomatok.net/api/io/notices";
const NOTICE_PAGE_SIZE = 10;
export const NOTICE_CATEGORIES = ["공지"] as const;
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

type NoticesApiItem = {
  io_notices_uid?: number | string;
  title?: string;
  body_html?: string;
  category?: string;
  notice_type?: string;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
};

type NoticesApiEnvelope = {
  code?: number;
  data?: {
    items?: NoticesApiItem[];
    page?: number;
    page_size?: number;
    total_count?: number;
    total_pages?: number;
  };
  msg?: string;
};

export type NoticeItem = {
  id: string;
  title: string;
  bodyHtml: string;
  category: NoticeCategory;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NoticePageResult = {
  items: NoticeItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

const NOTICE_TYPE_CATEGORY_MAP: Record<string, NoticeCategory> = {
  NOTICE: "공지",
};

function normalizeNoticeItem(item: NoticesApiItem): NoticeItem | null {
  const id = String(item.io_notices_uid ?? "").trim();
  if (!id) return null;

  const noticeType = typeof item.notice_type === "string" ? item.notice_type.trim().toUpperCase() : "";
  const category = NOTICE_TYPE_CATEGORY_MAP[noticeType] ?? "공지";

  return {
    id,
    title: typeof item.title === "string" ? item.title : "",
    bodyHtml: typeof item.body_html === "string" ? item.body_html : "",
    category,
    isVisible: item.is_visible !== false,
    createdAt: typeof item.created_at === "string" ? item.created_at : "",
    updatedAt: typeof item.updated_at === "string" ? item.updated_at : "",
  };
}

function getNoticesApiUrl(page: number) {
  const url = new URL(process.env.NOTICES_API_URL ?? DEFAULT_NOTICES_API_URL);
  url.searchParams.set("page", String(page));
  return url;
}

async function fetchNoticesApiPage(page: number) {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const response = await fetch(getNoticesApiUrl(safePage), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`공지사항 조회에 실패했습니다. (${response.status})`);
  }

  const payload = (await response.json()) as NoticesApiEnvelope;
  const data = payload.data;

  if (!data) {
    throw new Error(payload.msg || "공지사항 응답 형식이 올바르지 않습니다.");
  }

  return {
    rawItems: data.items ?? [],
    page: typeof data.page === "number" ? data.page : safePage,
    pageSize: typeof data.page_size === "number" ? data.page_size : NOTICE_PAGE_SIZE,
    totalCount: typeof data.total_count === "number" ? data.total_count : 0,
    totalPages: typeof data.total_pages === "number" ? data.total_pages : 1,
  };
}

async function fetchAllNoticeItems(): Promise<NoticeItem[]> {
  const firstPage = await fetchNoticesApiPage(1);
  const items = firstPage.rawItems
    .map(normalizeNoticeItem)
    .filter((item): item is NoticeItem => !!item && item.isVisible);

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const current = await fetchNoticesApiPage(page);
    items.push(
      ...current.rawItems
        .map(normalizeNoticeItem)
        .filter((item): item is NoticeItem => !!item && item.isVisible)
    );
  }

  return items;
}

export async function fetchNoticePage(page: number, category?: NoticeCategory | ""): Promise<NoticePageResult> {
  const safePage = Math.max(1, Math.floor(page) || 1);

  if (!category) {
    const apiPage = await fetchNoticesApiPage(safePage);
    return {
      items: apiPage.rawItems
        .map(normalizeNoticeItem)
        .filter((item): item is NoticeItem => !!item && item.isVisible),
      page: apiPage.page,
      pageSize: apiPage.pageSize,
      totalCount: apiPage.totalCount,
      totalPages: apiPage.totalPages,
    };
  }

  const allItems = await fetchAllNoticeItems();
  const filteredItems = allItems.filter((item) => item.category === category);
  const totalCount = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / NOTICE_PAGE_SIZE));
  const currentPage = Math.min(safePage, totalPages);
  const startIndex = (currentPage - 1) * NOTICE_PAGE_SIZE;
  const endIndex = startIndex + NOTICE_PAGE_SIZE;

  return {
    items: filteredItems.slice(startIndex, endIndex),
    page: currentPage,
    pageSize: NOTICE_PAGE_SIZE,
    totalCount,
    totalPages,
  };
}

export async function fetchNoticeById(id: string): Promise<NoticeItem | null> {
  const targetId = id.trim();
  if (!targetId) return null;

  const firstPage = await fetchNoticePage(1);
  const initialMatch = firstPage.items.find((item) => item.id === targetId) ?? null;
  if (initialMatch) return initialMatch;

  for (let page = 2; page <= firstPage.totalPages; page += 1) {
    const currentPage = await fetchNoticePage(page);
    const match = currentPage.items.find((item) => item.id === targetId);
    if (match) return match;
  }

  return null;
}
