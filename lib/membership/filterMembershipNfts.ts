import type { NFTAttributeLike, MembershipLevelStyle } from "@/lib/membership/getLevelStyle";
import { getMembershipLevelFromAttributes } from "@/lib/membership/getMembershipLevelFromAttributes";

type UnknownRecord = Record<string, unknown>;

export type MembershipCardAsset = {
  id: string;
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
  const firstGrouping = asRecord(grouping[0]);

  return (
    text(collection.name) ||
    text(collection.family) ||
    text(metadata.collection) ||
    text(firstGrouping.group_value) ||
    "TOMAKONGZ"
  );
}

export function filterMembershipNfts(items: unknown[]): MembershipCardAsset[] {
  if (!Array.isArray(items)) return [];

  const result: MembershipCardAsset[] = [];

  for (const item of items) {
    const asset = asRecord(item);
    if (!containsTomakongz(asset)) continue;

    const levelInfo = getMembershipLevelFromAttributes(extractAttributes(asset));
    if (!levelInfo) continue;

    result.push({
      id:
        text(asset.id) ||
        text(asset.mint) ||
        `${extractTitle(asset)}-${extractImage(asset)}`,
      image: extractImage(asset),
      title: extractTitle(asset),
      seriesName: extractSeriesName(asset),
      level: levelInfo.level,
      label: levelInfo.label,
      theme: levelInfo.theme,
      rawAsset: item,
    });
  }

  return result;
}
