import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Download, PackageCheck, Share2, Sparkles } from "lucide-react";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";
import { PACKS } from "@/lib/packs";
import { resolvePaidCheckoutFromSession } from "@/lib/stripe";
import { SuccessConfetti } from "@/components/SuccessConfetti";

export const metadata: Metadata = {
  title: "Figurinha criada! | Camisa 10",
  robots: { index: false },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://camisadez.vercel.app";

type SuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const checkout = await resolvePaidCheckoutFromSession(searchParams.session_id);

  if (!checkout || checkout.stickers.length === 0) {
    redirect("/");
  }

  const pack = checkout.pack;
  const config = PACKS[pack.packType];
  const whatsappText = encodeURIComponent(
    `Acabei de virar figurinha da Copa 2026! 🇧🇷⚽ Crie a sua também em ${siteUrl}`,
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
  const upsellPack = pack.packType === "individual" ? PACKS.familia : pack.packType === "dupla" ? PACKS.familia : null;

  const instagramText = encodeURIComponent(`Acabei de virar figurinha da Copa 2026! 🇧🇷⚽ Cria a sua em ${siteUrl}`);

  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9] px-5 py-8 sm:px-6">
      <SuccessConfetti />
      <section className="mx-auto w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-brasil-green text-white lg:mx-0">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black text-brasil-blue shadow-sm ring-1 ring-slate-200 lg:mx-0">
              <Sparkles className="h-4 w-4 text-brasil-green" />
              {config.title} liberado
            </div>
            <h1 className="mx-auto mt-5 max-w-xl text-3xl font-black leading-tight text-brasil-blue sm:text-5xl lg:mx-0">
              Pagamento confirmado. Suas figurinhas estão prontas.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Baixe o pack completo em ZIP ou salve cada PNG individualmente.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <a
                href={`/api/packs/${pack.id}/download`}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-brasil-green px-6 text-base font-black text-white shadow-xl shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633]"
              >
                <PackageCheck className="h-5 w-5" />
                Baixar todas (ZIP)
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-[#25D366] px-6 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1fbd5a]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.509 5.828L.057 23.5l5.793-1.517A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.058-1.383l-.361-.215-3.44.901.918-3.35-.236-.374A9.86 9.86 0 0 1 2.1 12c0-5.468 4.432-9.9 9.9-9.9 5.467 0 9.9 4.432 9.9 9.9 0 5.467-4.433 9.9-9.9 9.9z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={`https://www.instagram.com/?caption=${instagramText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] px-6 text-base font-black text-white shadow-lg transition hover:-translate-y-0.5"
              >
                <Share2 className="h-5 w-5" />
                Instagram
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {checkout.stickers.map((sticker, index) => (
              <article
                key={sticker.id}
                className="rounded-lg bg-white p-3 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200"
              >
                <img
                  src={`/api/stickers/${sticker.id}/image?variant=clean`}
                  alt={`Figurinha ${index + 1} sem marca d'água`}
                  className="aspect-[5/7] w-full rounded-lg object-cover"
                />
                <div className="mt-3">
                  <p className="truncate text-base font-black text-brasil-blue">
                    {toCardName(sticker.firstName, sticker.lastName)}
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                    {sticker.birthDate} | {formatHeight(sticker.heightCm)} | {sticker.weightKg} kg
                  </p>
                  <p className="mt-1 truncate text-xs font-black text-brasil-green">
                    {toTeamName(sticker.team)}
                  </p>
                  <a
                    href={`/api/stickers/${sticker.id}/image?variant=clean&download=1`}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brasil-blue px-4 text-sm font-black text-white transition hover:bg-[#061a4a]"
                  >
                    <Download className="h-4 w-4" />
                    Baixar PNG
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {upsellPack && (
        <section className="bg-[#f0fdf4] px-5 py-10 sm:px-6">
          <div className="mx-auto w-full max-w-3xl rounded-xl border-2 border-brasil-green bg-white p-6 shadow-lg shadow-brasil-green/10 sm:p-8">
            <p className="text-sm font-black uppercase text-brasil-green">Oferta especial</p>
            <h2 className="mt-2 text-2xl font-black leading-tight text-brasil-blue sm:text-3xl">
              Que tal criar para toda a família?
            </h2>
            <p className="mt-2 text-slate-600">
              {upsellPack.title} — {upsellPack.count} figurinhas por{" "}
              <strong className="text-brasil-blue">{upsellPack.priceLabel}</strong>
              {upsellPack.savingsLabel && (
                <span className="ml-2 text-sm font-bold text-brasil-green">
                  ({upsellPack.savingsLabel})
                </span>
              )}
            </p>
            <Link
              href={`/criar?pack=${upsellPack.type}`}
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-brasil-green px-6 text-base font-black text-white shadow-md shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633]"
            >
              Criar pack {upsellPack.shortTitle}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}

      <section className="bg-[#f9f9f9] px-5 py-6 text-center sm:px-6">
        <Link
          href="/criar"
          className="text-sm font-bold text-slate-500 underline-offset-2 hover:text-brasil-blue hover:underline"
        >
          Criar outro pack do zero
        </Link>
      </section>
    </main>
  );
}
