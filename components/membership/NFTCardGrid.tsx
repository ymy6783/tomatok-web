"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { NftCardList } from "@/components/membership/NftCardList";

type Props = {
  items: MembershipCardAsset[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function NFTCardGrid({ items, selectedId, onSelect }: Props) {
  return <NftCardList items={items} selectedId={selectedId} onSelect={onSelect} />;
}

