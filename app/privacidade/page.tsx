import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Camisa 10",
  description: "Como tratamos seus dados pessoais na plataforma Camisa 10.",
};

export default function PrivacidadePage() {
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
          <h1 className="text-3xl font-black text-brasil-blue">Política de Privacidade</h1>
          <p className="mt-2 text-sm text-slate-500">Última atualização: junho de 2026</p>

          <div className="prose prose-slate mt-8 max-w-none text-slate-700 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-brasil-blue [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:space-y-1 [&_ul]:pl-5 [&_li]:list-disc [&_li]:leading-7">

            <p>
              Esta Política de Privacidade descreve como a <strong>Camisa 10</strong>{" "}
              coleta, utiliza e protege as informações que você fornece ao criar sua
              figurinha personalizada. Estamos comprometidos com a proteção dos seus dados
              pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD —
              Lei nº 13.709/2018).
            </p>

            <h2>1. Dados coletados</h2>
            <p>Ao usar nosso serviço, coletamos:</p>
            <ul>
              <li><strong>Foto:</strong> imagem de rosto enviada para geração da figurinha.</li>
              <li><strong>Dados pessoais:</strong> nome, sobrenome, data de nascimento, altura, peso e time de coração.</li>
              <li><strong>Dados de pagamento:</strong> processados exclusivamente pelo Stripe. Não armazenamos número de cartão ou dados bancários.</li>
              <li><strong>Dados de sessão:</strong> identificador técnico da sua sessão para vinculação da figurinha ao pagamento.</li>
            </ul>

            <h2>2. Como utilizamos seus dados</h2>
            <ul>
              <li>Gerar a imagem da figurinha personalizada via inteligência artificial.</li>
              <li>Armazenar a imagem gerada para que você possa baixá-la após o pagamento.</li>
              <li>Processar o pagamento via Stripe e liberar o arquivo sem marca d&apos;água.</li>
            </ul>
            <p>
              Não utilizamos seus dados para publicidade, não os vendemos para terceiros
              e não os compartilhamos com nenhuma outra empresa além dos prestadores de
              serviço estritamente necessários (Stripe para pagamento, Supabase para
              armazenamento seguro e OpenAI para geração de imagem).
            </p>

            <h2>3. Armazenamento e retenção</h2>
            <p>
              Sua foto e a figurinha gerada são armazenadas em servidores seguros
              (Supabase / AWS S3) exclusivamente para permitir o download. Não definimos
              prazo fixo de exclusão, mas você pode solicitar a remoção dos seus dados
              a qualquer momento pelo e-mail abaixo.
            </p>

            <h2>4. Compartilhamento com terceiros</h2>
            <ul>
              <li><strong>Stripe:</strong> processamento de pagamento. Política: <a href="https://stripe.com/br/privacy" target="_blank" rel="noopener noreferrer" className="text-brasil-green underline">stripe.com/br/privacy</a></li>
              <li><strong>Supabase:</strong> armazenamento de dados e imagens.</li>
              <li><strong>OpenAI:</strong> geração de imagem via IA. Sua foto é enviada à API da OpenAI para criação da figurinha e não é usada para treinar modelos.</li>
            </ul>

            <h2>5. Seus direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul>
              <li>Confirmar a existência de tratamento dos seus dados.</li>
              <li>Acessar, corrigir ou eliminar seus dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar portabilidade dos dados.</li>
            </ul>
            <p>
              Para exercer qualquer desses direitos, entre em contato pelo e-mail:{" "}
              <strong>privacidade@camisadez.com.br</strong>
            </p>

            <h2>6. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus
              dados contra acesso não autorizado, perda ou destruição, incluindo
              comunicação via HTTPS e controles de acesso nos servidores de armazenamento.
            </p>

            <h2>7. Cookies</h2>
            <p>
              Utilizamos apenas cookies estritamente necessários para o funcionamento
              do site (sessão de navegação). Não utilizamos cookies de rastreamento ou
              publicidade.
            </p>

            <h2>8. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Alterações relevantes serão
              comunicadas no próprio site. O uso contínuo do serviço após a publicação
              das alterações implica aceitação da versão atualizada.
            </p>

            <h2>9. Contato</h2>
            <p>
              Dúvidas ou solicitações relacionadas à privacidade:{" "}
              <strong>privacidade@camisadez.com.br</strong>
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
