import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SocialProofStickers } from "@/components/SocialProofStickers";
import { StickerMock } from "@/components/StickerMock";
import { PACK_LIST } from "@/lib/packs";

const steps = [
  {
    icon: Camera,
    kicker: "01",
    title: "Envie sua foto e dados",
    text: "Preencha nome, data de nascimento, altura, peso e time.",
    time: "~2 min",
  },
  {
    icon: Sparkles,
    kicker: "02",
    title: "Veja sua figurinha",
    text: "A IA gera o preview personalizado — veja grátis antes de pagar.",
    time: "~60 seg",
  },
  {
    icon: CreditCard,
    kicker: "03",
    title: "Pague e baixe",
    text: "Por apenas R$9,90 você baixa o PNG limpo, sem marca d'água.",
    time: "~1 min",
  },
];

const proofItems = [
  { icon: Users, label: "+2.500", text: "figurinhas criadas" },
  { icon: ShieldCheck, label: "Stripe", text: "pagamento seguro" },
  { icon: Trophy, label: "2026", text: "visual de álbum" },
];

export default function Home() {
  return (
    <main className="bg-[#f9f9f9]">
      <div className="bg-gradient-to-r from-[#007a2e] via-brasil-green to-[#007a2e] px-5 py-2.5 text-center text-sm font-black text-white">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brasil-yellow" />
          Copa 2026 começa em junho &mdash; garanta sua figurinha antes!
          <span className="h-2 w-2 animate-pulse rounded-full bg-brasil-yellow" />
        </span>
      </div>
      <section className="hero-field relative isolate min-h-[78svh] overflow-hidden text-white">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#f9f9f9]" />
        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-brasil-yellow text-lg font-black text-brasil-blue shadow-lg shadow-black/10">
              10
            </div>
            <div>
              <span className="block text-xl font-black leading-none">Camisa 10</span>
              <span className="mt-1 hidden text-xs font-bold text-white/75 sm:block">
                figurinha personalizada
              </span>
            </div>
          </div>
          <Link
            href="#packs"
            className="hidden min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-black text-brasil-blue transition hover:bg-brasil-yellow sm:inline-flex"
          >
            Começar
          </Link>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(78svh-76px)] w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr_300px]">
          <div className="w-full">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-lg bg-white/14 px-3 py-2 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur sm:px-4">
              <BadgeCheck className="h-4 w-4 shrink-0 text-brasil-yellow" />
              <span className="truncate">Copa 2026 • preview antes de pagar</span>
            </div>
            <h1 className="max-w-[18ch] text-4xl font-black leading-[1.06] sm:max-w-[17ch] sm:text-5xl lg:text-6xl">
              Transforme você em figurinha da Copa 2026.
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/92 sm:text-lg">
              Crie uma figurinha exclusiva e personalizada no estilo Panini. Veja o resultado antes de pagar.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#packs"
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-brasil-green px-5 text-sm font-black text-white shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#008633] sm:w-auto sm:text-base"
              >
                Escolher meu pack
                <ArrowRight className="h-5 w-5" />
              </Link>
              <span className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white/12 px-4 text-sm font-black text-white ring-1 ring-white/20 backdrop-blur sm:justify-start">
                Mais de 2.500 figurinhas já criadas
              </span>
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div style={{ animation: "float 4s ease-in-out infinite" }}>
              <StickerMock name="VOCÊ" stats="Sua figurinha aqui" team="COPA 2026" accent="yellow" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 px-5 pb-14 sm:px-6">
        <div className="brand-rule mx-auto h-2 w-full max-w-6xl rounded-full" />
        <div className="mx-auto mt-8 grid w-full max-w-6xl gap-4 md:grid-cols-3">
          {proofItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-brasil-yellow text-brasil-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-black leading-none text-brasil-blue">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{item.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="packs" className="bg-white py-14">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="text-sm font-black uppercase text-brasil-green">Escolha seu pack</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-brasil-blue sm:text-4xl">
              Uma figurinha para você ou um álbum para a família.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A quantidade fica travada depois da escolha para deixar o fluxo simples e rápido.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PACK_LIST.map((pack) => (
              <article
                key={pack.type}
                className={
                  pack.popular
                    ? "relative overflow-hidden rounded-xl border-2 border-brasil-green bg-gradient-to-br from-[#f0fff6] to-[#e4f9ed] p-5 shadow-2xl shadow-brasil-green/20 ring-1 ring-brasil-green/30"
                    : "rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-slate-300"
                }
              >
                {pack.popular ? (
                  <>
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brasil-green/8" />
                    <div className="absolute -top-3 left-5 flex items-center gap-1.5 rounded-full bg-brasil-green px-3 py-1 text-xs font-black text-white shadow-lg">
                      <span className="h-1.5 w-1.5 rounded-full bg-brasil-yellow" />
                      MAIS POPULAR
                    </div>
                  </>
                ) : null}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black uppercase text-brasil-blue">{pack.title}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-600">
                      {pack.count} {pack.count === 1 ? "figurinha" : "figurinhas"}
                    </p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-brasil-yellow text-lg font-black text-brasil-blue">
                    {pack.count}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-4xl font-black text-brasil-blue">{pack.priceLabel}</p>
                  <p className="mt-2 min-h-5 text-sm font-bold text-brasil-green">
                    {pack.savingsLabel ?? "ideal para começar"}
                  </p>
                  {pack.count > 1 && (
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      R${((pack.priceCents / pack.count) / 100).toFixed(2).replace(".", ",")} por figurinha
                    </p>
                  )}
                </div>
                <Link
                  href={`/criar?pack=${pack.type}`}
                  className={
                    pack.popular
                      ? "mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brasil-green px-5 text-base font-black text-white shadow-lg shadow-brasil-green/25 transition hover:-translate-y-0.5 hover:bg-[#008633]"
                      : "mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brasil-blue px-5 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#061a4a]"
                  }
                >
                  Escolher
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="mb-8 grid gap-3 md:grid-cols-[1fr_0.7fr] md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-brasil-green">Galeria de exemplos</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-brasil-blue sm:text-4xl">
                Do campinho para o álbum
              </h2>
            </div>
            <p className="text-sm leading-6 text-slate-600 md:text-right">
              Exemplos do visual que você vai receber após o pagamento.
            </p>
          </div>
          <div className="grid justify-items-center gap-6 sm:grid-cols-3">
            <div className="-rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105">
              <StickerMock name="HELENA" stats="12-7-2016 | 1,32m | 28 kg" team="PALMEIRAS" accent="yellow" />
            </div>
            <div className="transition-all duration-300 hover:scale-105 sm:translate-y-6">
              <StickerMock name="MIGUEL" stats="4-3-2014 | 1,44m | 36 kg" team="FLAMENGO" accent="green" />
            </div>
            <div className="rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-105">
              <StickerMock name="ARTHUR" stats="21-9-2012 | 1,52m | 43 kg" team="CORINTHIANS" accent="blue" />
            </div>
          </div>
        </div>
      </section>

      <section className="subtle-field py-14">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase text-brasil-green">Como funciona</p>
            <h2 className="mt-2 text-3xl font-black text-brasil-blue sm:text-4xl">
              Sua figurinha em três passos
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-brasil-green text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black text-brasil-yellow">{step.kicker}</span>
                  </div>
                  <h3 className="text-xl font-black text-brasil-blue">{step.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brasil-green/10 px-3 py-1 text-xs font-black text-brasil-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-brasil-green" />
                    {step.time}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto w-full max-w-3xl px-5 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-sm font-black uppercase text-brasil-green">Dúvidas frequentes</p>
            <h2 className="mt-2 text-3xl font-black text-brasil-blue sm:text-4xl">Perguntas e respostas</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Quanto tempo leva para gerar a figurinha?",
                a: "Entre 30 e 90 segundos via IA. Em momentos de alta demanda pode levar até 2 minutos. O preview é mostrado assim que a geração termina.",
              },
              {
                q: "Vejo o resultado antes de pagar?",
                a: "Sim! Você vê o preview com marca d'água de graça. Só paga se quiser o arquivo limpo em PNG.",
              },
              {
                q: "Minha foto fica armazenada?",
                a: "Sua foto é usada apenas para gerar a figurinha e fica armazenada de forma segura para permitir o download. Não compartilhamos sua imagem com terceiros. Consulte nossa Política de Privacidade para mais detalhes.",
              },
              {
                q: "Posso imprimir a figurinha?",
                a: "Sim! O arquivo PNG tem resolução mínima de 800×1120px, ideal para impressão em gráficas, revelação digital ou papel fotográfico. Sugerimos impressão no tamanho de figurinha real (aprox. 6×8 cm).",
              },
              {
                q: "E se eu não gostar do resultado?",
                a: "Você pode ver o preview antes de pagar e decidir se quer comprar. Se o resultado gerado pela IA não ficar bom, tente com uma foto diferente — rosto nítido, boa iluminação e fundo limpo dão os melhores resultados.",
              },
              {
                q: "Quais formatos de foto são aceitos?",
                a: "JPG, PNG ou WEBP, até 10MB. No celular você pode tirar uma selfie na hora ou escolher da galeria.",
              },
              {
                q: "Posso criar figurinha de outra pessoa como presente?",
                a: "Sim! Basta enviar a foto e preencher os dados da pessoa. É um presente personalizado e único.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-lg bg-[#f9f9f9] ring-1 ring-slate-200 open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-black text-brasil-blue">
                  {q}
                  <span className="shrink-0 text-brasil-green transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brasil-blue py-14 text-white">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="grid gap-8 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
            <div>
              <p className="text-sm font-black uppercase text-brasil-yellow">Prova social</p>
              <h2 className="mt-2 text-4xl font-black">
                <AnimatedCounter target={2500} /> figurinhas criadas
              </h2>
              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-white/75">
                Exemplos reais do visual que guia a criação das novas figurinhas.
              </p>
            </div>
            <div className="rounded-lg bg-white/10 px-5 py-4 text-4xl leading-relaxed ring-1 ring-white/15 sm:text-5xl" aria-label="Bandeiras de países">
              🇧🇷 🇦🇷 🇫🇷 🇩🇪 🇪🇸
            </div>
          </div>

          <div className="mt-9">
            <SocialProofStickers />
          </div>
        </div>
      </section>

      <section className="bg-[#06132f] py-10 text-white">
        <div className="mx-auto w-full max-w-6xl px-5 text-center sm:px-6 md:text-left">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-black uppercase text-brasil-yellow">Começar</p>
              <h2 className="mt-2 text-2xl font-black">Pronto para virar figurinha?</h2>
            </div>
            <Link
              href="#packs"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brasil-green px-6 text-base font-black text-white transition hover:bg-[#008633]"
            >
              Escolher pack
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#06132f] px-5 py-8 text-center text-sm text-white sm:px-6">
        <p>© 2026 Camisa 10. Todos os direitos reservados.</p>
        <nav className="mt-3 flex justify-center gap-5 font-bold">
          <Link href="/termos" className="hover:text-brasil-yellow">
            Termos de Uso
          </Link>
          <Link href="/privacidade" className="hover:text-brasil-yellow">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </main>
  );
}
