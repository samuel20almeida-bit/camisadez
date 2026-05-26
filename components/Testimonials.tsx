import { Star } from "lucide-react";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/FadeUp";

const TESTIMONIALS = [
  {
    name: "Fernanda Costa",
    location: "São Paulo, SP",
    rating: 5,
    text: "Fiz para o meu sobrinho de 8 anos como presente de aniversário. Ele ficou sem fala quando viu! O rosto saiu idêntico, a camisa do Brasil perfeita. Valeu muito os R$9,90.",
    initials: "FC",
    color: "bg-brasil-green",
    product: "Pack Individual",
  },
  {
    name: "Ricardo Alves",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Criei figurinhas para mim, pra minha esposa e pros meus dois filhos. O Pack Família saiu super em conta. Qualidade incrível, parece figurinha de verdade.",
    initials: "RA",
    color: "bg-brasil-blue",
    product: "Pack Família",
  },
  {
    name: "Juliana Mendes",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Impressionante a qualidade da IA! Usei uma foto simples do celular e ficou fotorrealista. Já enviei para todos os amigos que amaram também.",
    initials: "JM",
    color: "bg-[#9333ea]",
    product: "Pack Dupla",
  },
  {
    name: "Carlos Eduardo",
    location: "Curitiba, PR",
    rating: 5,
    text: "Comprei como lembrança da Copa 2026. Já imprimi em tamanho real e ficou espetacular. O processo todo levou menos de 5 minutos.",
    initials: "CE",
    color: "bg-[#ea580c]",
    product: "Pack Individual",
  },
  {
    name: "Aline Ribeiro",
    location: "Fortaleza, CE",
    rating: 5,
    text: "De cara achei que era golpe, mas o preview saiu incrível antes mesmo de pagar. Paguei na hora! Atendimento e entrega imediata. Recomendo demais.",
    initials: "AR",
    color: "bg-brasil-cyan",
    product: "Pack Família",
  },
  {
    name: "Thiago Santos",
    location: "Porto Alegre, RS",
    rating: 5,
    text: "Fiz de surpresa pra minha turma de futsal. Todo mundo ficou chapado com a qualidade. Parece figurinha original do álbum Panini.",
    initials: "TS",
    color: "bg-[#0891b2]",
    product: "Pack Família",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#FFDF00] text-[#FFDF00]" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-[#f9f9f9] py-14">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <FadeUp className="mb-8 text-center">
          <p className="text-sm font-black uppercase text-brasil-green">Avaliações</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-brasil-blue sm:text-4xl">
            Quem criou, aprovou
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <StarRow count={5} />
            <span className="text-sm font-bold text-slate-600">4,9 / 5 · mais de 2.500 figurinhas criadas</span>
          </div>
        </FadeUp>

        <StaggerChildren className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <article className="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start gap-3">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-black text-white ${t.color}`}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-brasil-blue">{t.name}</p>
                    <p className="text-xs font-semibold text-slate-400">{t.location}</p>
                  </div>
                </div>
                <StarRow count={t.rating} />
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-xs font-black uppercase text-brasil-green">{t.product}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
