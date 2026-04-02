import type { NFTAttributeLike, MembershipLevelStyle } from "@/lib/membership/getLevelStyle";
import { getMembershipLevelFromAttributes } from "@/lib/membership/getMembershipLevelFromAttributes";

type UnknownRecord = Record<string, unknown>;

export type MembershipCardAsset = {
  id: string;
  mint: string;
  image: string;
  title: string;
  seriesName: string;
  level: MembershipLevelStyle["level"];
  label: MembershipLevelStyle["label"];
  theme: MembershipLevelStyle["theme"];
  rawAsset: unknown;
};

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalize(value: unknown): string {
  return text(value).trim().toLowerCase().replace(/[\s._-]/g, "");
}

function includesTomakongz(value: unknown): boolean {
  return normalize(value).includes("tomakongz");
}

function asRecord(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function extractAttributes(asset: UnknownRecord): NFTAttributeLike[] {
  const content = asRecord(asset.content);
  const metadata = asRecord(content.metadata);
  const attrs = metadata.attributes;
  return Array.isArray(attrs) ? (attrs as NFTAttributeLike[]) : [];
}

function inferMembershipLevel(asset: UnknownRecord): MembershipLevelStyle | null {
  const blob = JSON.stringify({
    name: asset.name,
    symbol: asset.symbol,
    content: asset.content,
    collection: asset.collection,
    grouping: asset.grouping,
  }).toLowerCase();

  if (blob.includes("lv3") || blob.includes("level3") || blob.includes("gold")) {
    return { level: "lv3", label: "LV.3", theme: "gold" };
  }

  if (blob.includes("lv2") || blob.includes("level2") || blob.includes("silver")) {
    return { level: "lv2", label: "LV.2", theme: "silver" };
  }

  if (blob.includes("lv1") || blob.includes("level1") || blob.includes("white")) {
    return { level: "lv1", label: "LV.1", theme: "white" };
  }

  return null;
}

function getDefaultMembershipLevel(): MembershipLevelStyle {
  return { level: "lv1", label: "LV.1", theme: "white" };
}

export function containsTomakongz(assetLike: unknown): boolean {
  const asset = asRecord(assetLike);
  const content = asRecord(asset.content);
  const metadata = asRecord(content.metadata);
  const collection = asRecord(asset.collection);
  const grouping = asArray(asset.grouping);

  const directCandidates = [
    asset.name,
    asset.symbol,
    collection.name,
    collection.family,
    metadata.name,
    metadata.symbol,
    metadata.collection,
    metadata.description,
  ];

  if (directCandidates.some(includesTomakongz)) {
    return true;
  }

  for (const group of grouping) {
    const g = asRecord(group);
    if (includesTomakongz(g.group_key) || includesTomakongz(g.group_value)) {
      return true;
    }
  }

  // Fallback: metadata/object 문자열에 TOMAKONGZ가 포함되는지 안전하게 검사
  const metadataBlob = JSON.stringify({ metadata, collection, grouping }).toLowerCase();
  return metadataBlob.includes("tomakongz");
}

function extractImage(asset: UnknownRecord): string {
  const content = asRecord(asset.content);
  const links = asRecord(content.links);
  const files = asArray(content.files);

  const fileUri = files
    .map((f) => asRecord(f).uri)
    .find((v) => typeof v === "string" && v.length > 0);

  return (
    text(links.image) ||
    text(fileUri) ||
    text(asset.image) ||
    "/images/section5_img1.png"
  );
}

function extractTitle(asset: UnknownRecord): string {
  const content = asRecord(asset.content);
  const metadata = asRecord(content.metadata);
  return text(asset.name) || text(metadata.name) || "Unknown NFT";
}

function extractSeriesName(asset: UnknownRecord): string {
  const content = asRecord(asset.content);
  const metadata = asRecord(content.metadata);
  const collection = asRecord(asset.collection);
  const grouping = asArray(asset.grouping);
  const metadataCollection = asRecord(metadata.collection);

  const fromGrouping = grouping
    .map((g) => asRecord(g))
    .filter((g) => {
      const key = normalize(g.group_key);
      return key.includes("collection") || key.includes("family") || key.includes("group");
    })
    .map((g) => text(g.group_value));

  const candidates = [
    text(collection.name),
    text(collection.family),
    text(metadataCollection.name),
    text(metadataCollection.family),
    text(metadata.collection),
    ...fromGrouping,
  ]
    .map((v) => v.trim())
    .filter(Boolean);

  const cleaned = candidates.filter((v) => {
    // 내부 식별자/주소/URI처럼 보이는 값은 시리즈명 후보에서 제외
    if (v.length < 3 || v.length > 80) return false;
    if (/[/:\\]/.test(v)) return false;
    if (/^[a-f0-9]{24,}$/i.test(v)) return false;
    if (/^[A-Za-z0-9_-]{24,}$/.test(v)) return false;
    return true;
  });

  const tomakongzFirst = cleaned.find(includesTomakongz);
  if (tomakongzFirst) return tomakongzFirst;
  if (cleaned.length > 0) return cleaned[0];
  return "TOMAKONGZ";
}

export function filterMembershipNfts(items: unknown[]): MembershipCardAsset[] {
  if (!Array.isArray(items)) return [];

  const result: MembershipCardAsset[] = [];

  for (const item of items) {
    const asset = asRecord(item);
    if (!containsTomakongz(asset)) continue;

    const levelInfo =
      getMembershipLevelFromAttributes(extractAttributes(asset)) ||
      inferMembershipLevel(asset);
    const resolvedLevelInfo = levelInfo ?? getDefaultMembershipLevel();

    result.push({
      id:
        text(asset.id) ||
        text(asset.mint) ||
        `${extractTitle(asset)}-${extractImage(asset)}`,
      mint: text(asset.mint) || text(asset.id),
      image: extractImage(asset),
      title: extractTitle(asset),
      seriesName: extractSeriesName(asset),
      level: resolvedLevelInfo.level,
      label: resolvedLevelInfo.label,
      theme: resolvedLevelInfo.theme,
      rawAsset: item,
    });
  }

  return result;
}
