"use client";

import { useState } from "react";
import { REFERENCE_STICKERS, type ReferenceStickerAsset } from "@/lib/reference-assets";

export function SocialProofStickers() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {REFERENCE_STICKERS.map((asset) => (
        <SocialProofCard key={asset.slug} asset={asset} />
      ))}
    </div>
  );
}

function SocialProofCard({ asset }: { asset: ReferenceStickerAsset }) {
  const [hasImage, setHasImage] = useState(true);

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-lg shadow-black/10 ring-1 ring-white/15">
      <div className="relative aspect-[5/7] bg-brasil-cyan">
        {hasImage ? (
          <img
            src={asset.src}
            alt={`Figurinha de ${asset.name}`}
            className="h-full w-full object-cover"
            onError={() => setHasImage(false)}
          />
        ) : (
          <div className="grid h-full place-items-center p-5 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-brasil-yellow text-2xl font-black text-brasil-blue">
                26
              </div>
              <p className="mt-4 text-lg font-black uppercase text-white">{asset.name}</p>
              <p className="mt-2 text-sm font-bold text-white/80">
                Salve `{asset.filename}` em `public/social-proof`
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-base font-black uppercase text-brasil-blue">{asset.name}</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">{asset.stats}</p>
        <p className="mt-1 text-sm font-black uppercase text-brasil-green">{asset.team}</p>
      </div>
    </article>
  );
}
