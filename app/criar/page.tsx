import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Criar figurinha | Camisa 10",
  robots: { index: false },
};
import { FormWizard } from "@/components/FormWizard";
import { PACKS, normalizePackType } from "@/lib/packs";

type CriarPageProps = {
  searchParams: {
    pack?: string;
  };
};

export default function CriarPage({ searchParams }: CriarPageProps) {
  const packType = normalizePackType(searchParams.pack);
  const pack = PACKS[packType];

  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9] px-5 py-5 sm:px-6">
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-brasil-blue shadow-sm ring-1 ring-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Camisa 10
        </Link>
        <span className="max-w-[48vw] truncate rounded-lg bg-brasil-yellow px-4 py-2 text-sm font-black text-brasil-blue">
          {pack.shortTitle} • {pack.priceLabel}
        </span>
      </div>
      <FormWizard packType={packType} />
    </main>
  );
}
