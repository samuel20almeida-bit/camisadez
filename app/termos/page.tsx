import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Camisa 10",
  description: "Termos e condições de uso da plataforma Camisa 10.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] px-5 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-brasil-blue shadow-sm ring-1 ring-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Camisa 10
        </Link>

        <article className="mt-8 rounded-lg bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <h1 className="text-3xl font-black text-brasil-blue">Termos de Uso</h1>
          <p className="mt-2 text-sm text-slate-500">Última atualização: junho de 2026</p>

          <div className="prose prose-slate mt-8 max-w-none text-slate-700 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-brasil-blue [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:pl-5 [&_li]:list-disc [&_li]:leading-7">

            <p>
              Ao utilizar a plataforma <strong>Camisa 10</strong> (disponível em{" "}
              camisadez.vercel.app), você concorda com os presentes Termos de Uso. Leia-os
              com atenção antes de prosseguir.
            </p>

            <h2>1. Descrição do serviço</h2>
            <p>
              A Camisa 10 é uma plataforma digital que permite a criação de figurinhas
              personalizadas no estilo visual da Copa do Mundo 2026. O serviço gera uma
              imagem de preview gratuitamente e disponibiliza a versão sem marca d&apos;água
              mediante pagamento.
            </p>

            <h2>2. Uso permitido</h2>
            <ul>
              <li>O arquivo gerado é destinado exclusivamente ao <strong>uso pessoal e não comercial</strong>.</li>
              <li>É permitido imprimir a figurinha para uso próprio, presentear ou compartilhar nas redes sociais.</li>
              <li>É proibido revender, sublicenciar ou usar a imagem com fins comerciais sem autorização prévia.</li>
              <li>O usuário deve ter plenos direitos sobre a foto enviada. É proibido enviar fotos de terceiros sem consentimento.</li>
            </ul>

            <h2>3. Conteúdo proibido</h2>
            <p>É estritamente proibido enviar imagens que contenham:</p>
            <ul>
              <li>Nudez ou conteúdo sexualmente explícito.</li>
              <li>Violência, discurso de ódio ou conteúdo discriminatório.</li>
              <li>Dados de menores de idade sem o consentimento do responsável legal.</li>
              <li>Material protegido por direitos autorais de terceiros.</li>
            </ul>
            <p>
              O descumprimento dessas regras pode resultar na suspensão do acesso e,
              se aplicável, em medidas legais.
            </p>

            <h2>4. Pagamento e política de reembolso</h2>
            <p>
              O pagamento é processado via Stripe. Ao confirmar o pagamento, o arquivo
              digital é gerado e disponibilizado imediatamente para download.
            </p>
            <p>
              Por se tratar de um <strong>bem digital entregue imediatamente</strong> após
              a confirmação do pagamento, não oferecemos reembolso após a disponibilização
              do download, conforme permitido pelo art. 49 do Código de Defesa do
              Consumidor para bens digitais com execução imediata e consentimento expresso
              do consumidor.
            </p>
            <p>
              Se houver falha técnica que impeça o download, entre em contato pelo e-mail
              de suporte e resolveremos em até 48 horas.
            </p>

            <h2>5. Disponibilidade do serviço</h2>
            <p>
              O serviço é disponibilizado &quot;como está&quot;. Não garantimos disponibilidade
              ininterrupta. A geração de imagem via IA pode variar entre 30 segundos e
              alguns minutos dependendo da demanda.
            </p>

            <h2>6. Propriedade intelectual</h2>
            <p>
              O layout, código-fonte e identidade visual da plataforma são de propriedade
              da Camisa 10. O visual das figurinhas é inspirado no estilo de álbuns de
              Copa do Mundo e não possui vínculo oficial com a FIFA, Panini ou qualquer
              entidade esportiva.
            </p>

            <h2>7. Limitação de responsabilidade</h2>
            <p>
              A Camisa 10 não se responsabiliza por danos indiretos decorrentes do uso
              do serviço, incluindo perda de arquivos após o período de disponibilidade.
              Recomendamos salvar o arquivo imediatamente após o download.
            </p>

            <h2>8. Alterações nos termos</h2>
            <p>
              Reservamo-nos o direito de alterar estes Termos a qualquer momento. O uso
              continuado do serviço após a publicação de novas versões implica aceitação
              das mudanças.
            </p>

            <h2>9. Foro e legislação aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação brasileira. Para dirimir
              controvérsias, fica eleito o foro da comarca de São Paulo - SP.
            </p>

            <h2>10. Contato</h2>
            <p>
              Suporte e dúvidas: <strong>suporte@camisadez.com.br</strong>
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
