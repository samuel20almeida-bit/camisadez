import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Download, PackageCheck, Sparkles } from "lucide-react";
import { formatHeight, toCardName, toTeamName } from "@/lib/format";
import { PACKS } from "@/lib/packs";
import { resolvePaidCheckoutFromSession } from "@/lib/stripe";

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

  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9] px-5 py-8 sm:px-6">
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
              <Link
                href="/criar"
                className="inline-flex min-h-14 items-center justify-center rounded-lg bg-white px-6 text-base font-black text-brasil-blue shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                Criar outro pack
              </Link>
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
    </main>
  );
}
