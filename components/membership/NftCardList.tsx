"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { NFTCardStatic } from "@/components/membership/NFTCardStatic";

type Props = {
  items: MembershipCardAsset[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function NftCardList({ items, selectedId, onSelect }: Props) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <NFTCardStatic item={item} selected={item.id === selectedId} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}
