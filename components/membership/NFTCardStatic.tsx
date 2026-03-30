"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { NFTCardListContent } from "@/components/membership/NFTCardListContent";

type Props = {
  item: MembershipCardAsset;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function NFTCardStatic({ item, selected, onSelect }: Props) {
  return (
    <button type="button" onClick={() => onSelect(item.id)} className="group w-full text-left">
      <NFTCardListContent item={item} selected={selected} />
    </button>
  );
}
