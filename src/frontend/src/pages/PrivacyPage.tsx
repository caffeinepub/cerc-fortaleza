import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Shield } from "lucide-react";

const YEAR = new Date().getFullYear();

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-display font-bold text-privacy-navy mb-3 pb-2 border-b border-privacy-border">
        {title}
      </h2>
      <div className="text-privacy-body text-base leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-privacy-bg">
      {/* Header */}
      <header className="bg-secondary">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-4">
          <Link to="/">
            <div className="bg-white rounded-xl px-4 py-2 shadow">
              <img
                src="/assets/uploads/LOGO-COM-NOME-1-1.png"
                alt="CERC FORTALEZA — Cadastro de Eletrônicos e Registros Ceará"
                className="h-14 w-auto"
              />
            </div>
          </Link>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Shield className="w-4 h-4 text-accent" />
            <span>Política de Privacidade e Proteção de Dados</span>
          </div>
        </div>
      </header>

      {/* Back nav */}
      <div className="container mx-auto px-4 pt-6">
        <Link to="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-privacy-muted hover:text-privacy-navy gap-1.5 pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Button>
        </Link>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-privacy-navy tracking-tight mb-2">
            Política de Privacidade
          </h1>
          <p className="text-privacy-muted text-sm">
            Última atualização:{" "}
            <strong className="text-privacy-navy">Fevereiro de 2026</strong>
          </p>
        </div>

        <Section title="1. Introdução">
          <p>
            O{" "}
            <strong>
              CERC FORTALEZA — Cadastro de Eletrônicos e Registros Ceará
            </strong>{" "}
            está comprometido com a proteção dos seus dados pessoais, em total
            conformidade com a{" "}
            <strong>
              Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)
            </strong>
            .
          </p>
          <p>
            Esta Política de Privacidade descreve como coletamos, utilizamos,
            armazenamos e protegemos as informações que você nos fornece ao
            utilizar nossos serviços. Ao se cadastrar e utilizar o CERC
            FORTALEZA, você concorda com os termos descritos neste documento.
          </p>
        </Section>

        <Section title="2. Dados Coletados">
          <p>
            Para prestar nossos serviços, coletamos as seguintes informações:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Nome completo;</li>
            <li>Número de WhatsApp (com DDD);</li>
            <li>
              Identificadores únicos de objetos cadastrados (IMEI, número de
              série, chassi);
            </li>
            <li>Fotos de objetos (quando enviadas pelo usuário);</li>
            <li>
              Número de Boletim de Ocorrência (quando aplicável ao reporte de
              roubo);
            </li>
            <li>
              Dados de localização do incidente (quando informado
              voluntariamente pelo usuário).
            </li>
          </ul>
          <p className="mt-2 text-sm text-privacy-muted">
            Não coletamos dados bancários, senhas ou informações sensíveis além
            das listadas acima.
          </p>
        </Section>

        <Section title="3. Finalidade do Tratamento">
          <p>
            Os dados coletados são utilizados exclusivamente para as seguintes
            finalidades:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Prevenção ao comércio de bens roubados em Fortaleza e no Ceará;
            </li>
            <li>
              Consulta de procedência de objetos por qualquer cidadão ou
              estabelecimento comercial;
            </li>
            <li>
              Comunicação via WhatsApp sobre seu cadastro, atualizações e
              alertas de segurança;
            </li>
            <li>Melhoria contínua do sistema e da experiência do usuário;</li>
            <li>
              Colaboração com autoridades policiais do Estado do Ceará mediante
              requisição legal formal.
            </li>
          </ul>
        </Section>

        <Section title="4. Armazenamento e Segurança">
          <p>
            Os seus dados são armazenados de forma segura na infraestrutura{" "}
            <strong>blockchain da Internet Computer (ICP)</strong>, tecnologia
            descentralizada com criptografia de ponta a ponta.
          </p>
          <p>
            Diferente de sistemas tradicionais, não há servidores centralizados
            vulneráveis a ataques convencionais — os dados ficam distribuídos e
            protegidos pela rede blockchain.
          </p>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger
            seus dados contra acessos não autorizados, divulgação, alteração ou
            destruição.
          </p>
        </Section>

        <Section title="5. Compartilhamento de Dados">
          <p>
            Seus dados pessoais{" "}
            <strong className="text-accent">
              NÃO são vendidos a terceiros
            </strong>{" "}
            sob nenhuma hipótese.
          </p>
          <p>
            O compartilhamento de dados ocorre apenas nas seguintes situações:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Autoridades policiais do Ceará</strong> — mediante
              requisição legal devidamente fundamentada;
            </li>
            <li>
              <strong>Parceiros de segurança pública</strong> — com a finalidade
              exclusiva de recuperação de bens roubados ou extraviados.
            </li>
          </ul>
        </Section>

        <Section title="6. Seus Direitos (LGPD)">
          <p>
            Como titular dos seus dados pessoais, você tem os seguintes direitos
            garantidos pela LGPD:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Acesso</strong> — solicitar uma cópia dos seus dados que
              mantemos;
            </li>
            <li>
              <strong>Correção</strong> — solicitar a atualização de dados
              incompletos, inexatos ou desatualizados;
            </li>
            <li>
              <strong>Exclusão</strong> — solicitar a remoção dos seus dados
              pessoais do sistema;
            </li>
            <li>
              <strong>Portabilidade</strong> — receber seus dados em formato
              estruturado para uso em outro serviço;
            </li>
            <li>
              <strong>Revogação do consentimento</strong> — retirar sua
              autorização a qualquer momento, sem prejuízo do tratamento
              realizado anteriormente.
            </li>
          </ul>
          <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-privacy-navy text-sm">
                Para exercer seus direitos, entre em contato:
              </p>
              <a
                href="mailto:proj.defdriver+pagbank@gmail.com"
                className="text-primary hover:underline text-sm font-medium"
              >
                proj.defdriver+pagbank@gmail.com
              </a>
            </div>
          </div>
        </Section>

        <Section title="7. Retenção de Dados">
          <p>
            Os dados são mantidos enquanto o usuário possuir cadastro ativo no
            sistema CERC FORTALEZA.
          </p>
          <p>
            Após uma solicitação formal de exclusão, os dados pessoais serão
            removidos permanentemente em até <strong>30 (trinta) dias</strong>,
            salvo quando a retenção for necessária para cumprimento de obrigação
            legal ou regulatória.
          </p>
        </Section>

        <Section title="8. Contato">
          <p>Para dúvidas, solicitações ou reclamações sobre esta Política:</p>
          <div className="mt-3 space-y-1 text-sm">
            <p>
              <strong>E-mail:</strong>{" "}
              <a
                href="mailto:proj.defdriver+pagbank@gmail.com"
                className="text-primary hover:underline"
              >
                proj.defdriver+pagbank@gmail.com
              </a>
            </p>
            <p>
              <strong>Organização:</strong> CERC FORTALEZA — Cadastro de
              Eletrônicos e Registros Ceará
            </p>
          </div>
        </Section>

        <Section title="9. Atualizações desta Política">
          <p>
            Esta política de privacidade pode ser atualizada periodicamente para
            refletir mudanças em nossas práticas ou na legislação aplicável. A
            data da última revisão será sempre indicada no topo desta página.
          </p>
          <p>
            Recomendamos que você revise esta política regularmente. Mudanças
            significativas serão comunicadas através do nosso canal de WhatsApp.
          </p>
          <p className="text-sm text-privacy-muted">
            <strong>Data desta versão:</strong> Fevereiro de 2026
          </p>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary mt-12">
        <div className="container mx-auto px-4 py-8 text-center space-y-2">
          <p className="text-sm text-white/50">
            © {YEAR} CERC FORTALEZA. Todos os direitos reservados.
          </p>
          <Link
            to="/"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            ← Voltar à página inicial
          </Link>
        </div>
      </footer>
    </div>
  );
}
