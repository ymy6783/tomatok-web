"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { NFTCardStatic } from "@/components/membership/NFTCardStatic";

type Props = {
  items: MembershipCardAsset[];
  registeredMints: Set<string>;
  selectedId: string;
  savingMint: string;
  onSelect: (id: string) => void;
  onSave: (item: MembershipCardAsset) => void;
};

export function NftCardList({ items, registeredMints, selectedId, savingMint, onSelect, onSave }: Props) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <NFTCardStatic
            item={item}
            registered={registeredMints.has(item.mint)}
            selected={item.id === selectedId}
            saving={savingMint === item.mint}
            onSelect={onSelect}
            onSave={onSave}
          />
        </li>
      ))}
    </ul>
  );
}
