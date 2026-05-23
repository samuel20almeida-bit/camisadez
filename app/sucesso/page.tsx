import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Download, Sparkles } from "lucide-react";
import { resolvePaidStickerFromSession } from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sticker = await resolvePaidStickerFromSession(searchParams.session_id);

  if (!sticker) {
    redirect("/");
  }

  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9] px-5 py-8 sm:px-6">
      <section className="mx-auto grid w-full max-w-6xl gap-9 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[306px] overflow-hidden rounded-[18px] bg-white shadow-sticker ring-4 ring-white sm:max-w-[360px]">
          <img
            src={`/api/stickers/${sticker.id}/image?variant=clean`}
            alt="Figurinha personalizada sem marca d'água"
            className="block aspect-[5/7] w-full object-cover"
          />
        </div>

        <div className="text-center lg:text-left">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-brasil-green text-white lg:mx-0">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black text-brasil-blue shadow-sm ring-1 ring-slate-200 lg:mx-0">
            <Sparkles className="h-4 w-4 text-brasil-green" />
            Versão final liberada
          </div>
          <h1 className="mx-auto mt-5 max-w-[19rem] text-2xl font-black leading-tight text-brasil-blue sm:max-w-2xl sm:text-5xl lg:mx-0">
            Pagamento confirmado. Sua figurinha está pronta.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Baixe o PNG em alta resolução e guarde sua versão de camisa 10.
          </p>
          <a
            href={`/api/stickers/${sticker.id}/image?variant=clean&download=1`}
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-brasil-green px-6 text-base font-black text-white shadow-xl shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633] sm:w-auto"
          >
            <Download className="h-5 w-5" />
            Baixar minha figurinha (PNG)
          </a>
          <div className="mt-5">
            <Link href="/criar" className="font-black text-brasil-blue hover:text-brasil-green">
              Criar outra figurinha
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
