"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";

type PreviewClientProps = {
  stickerId?: string;
};

export function PreviewClient({ stickerId }: PreviewClientProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    if (!stickerId) {
      return;
    }

    setIsCheckingOut(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ packType: "individual", stickerIds: [stickerId] }),
    });

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !result.url) {
      setIsCheckingOut(false);
      setError(result.error ?? "Não foi possível abrir o checkout.");
      return;
    }

    window.location.href = result.url;
  };

  if (!stickerId) {
    return (
      <div className="mx-auto grid min-h-screen max-w-xl place-items-center px-5 text-center">
        <div>
          <h1 className="text-3xl font-black text-brasil-blue">Figurinha não encontrada</h1>
          <p className="mt-3 text-slate-600">Volte ao formulário para criar uma nova versão.</p>
          <Link
            href="/criar"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-brasil-green px-6 font-black text-white"
          >
            Criar figurinha
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="subtle-field min-h-screen bg-[#f9f9f9]">
      <section className="mx-auto grid w-full max-w-6xl gap-9 px-5 py-8 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-center lg:py-14">
        <div className="mx-auto w-full max-w-[306px] sm:max-w-[360px]">
          <div className="watermark-preview relative overflow-hidden rounded-[18px] bg-white shadow-sticker ring-4 ring-white">
            {!isImageLoaded ? (
              <div
                className="absolute inset-0 z-10 grid place-items-center bg-white"
                aria-hidden="true"
              >
                <Loader2 className="h-10 w-10 animate-spin text-brasil-green" />
              </div>
            ) : null}
            <img
              src={`/api/stickers/${stickerId}/image?variant=preview`}
              alt="Preview da figurinha com marca d'água"
              className="block aspect-[5/7] w-full object-cover"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </div>
        </div>

        <div className="text-center lg:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-lg bg-brasil-yellow px-4 py-2 text-sm font-black text-brasil-blue lg:mx-0">
            <Sparkles className="h-4 w-4" />
            Preview liberado
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight text-brasil-blue sm:text-5xl">
            Gostou? Remova a marca d&apos;água por R$9,90.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Após a confirmação, você recebe a versão limpa em PNG com resolução mínima de 800x1100px.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4 text-left shadow-sm ring-1 ring-slate-200">
              <Lock className="h-5 w-5 text-brasil-green" />
              <p className="mt-2 text-sm font-black text-brasil-blue">Arquivo sem marca</p>
              <p className="mt-1 text-sm text-slate-600">Download liberado logo após o pagamento.</p>
            </div>
            <div className="rounded-lg bg-white p-4 text-left shadow-sm ring-1 ring-slate-200">
              <ShieldCheck className="h-5 w-5 text-brasil-green" />
              <p className="mt-2 text-sm font-black text-brasil-blue">Checkout seguro</p>
              <p className="mt-1 text-sm text-slate-600">Pagamento hospedado via Stripe.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={isCheckingOut}
            className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-brasil-green px-6 text-base font-black text-white shadow-xl shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {isCheckingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CreditCard className="h-5 w-5" />
            )}
            Pagar R$9,90 e baixar
          </button>
          <p className="mt-3 text-sm font-medium text-slate-500">
            Pagamento seguro via Stripe • Acesso imediato após confirmação
          </p>
          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
