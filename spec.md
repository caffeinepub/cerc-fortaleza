# CERC Fortaleza - Landing Page de Proteção de Bens

## Current State

Projeto novo, sem código existente. Workspace vazio pronto para receber a aplicação.

## Requested Changes (Diff)

### Add

**Backend:**
- Sistema de captura de leads com campos: Nome (texto) e WhatsApp (texto)
- Endpoint para salvar cadastros de usuários interessados
- Armazenamento persistente dos leads capturados

**Frontend - Hero Section:**
- Seção Hero com fundo cinza claro (#F5F5F5)
- Mapa de Fortaleza como imagem de fundo com opacidade 10%
- Título (H1) em azul marinho (#003366), fonte sem serifa (Inter/Montserrat), negrito: "Fortaleza mais segura: Não deixe seu celular ou sua bike virarem estatística"
- Subtítulo explicativo do benefício imediato
- Logo/texto "CERC Fortaleza" no topo esquerdo

**Frontend - Formulário de Conversão:**
- Card branco centralizado com sombra suave e bordas arredondadas
- 2 inputs apenas: "Nome" e "WhatsApp"
- Botão CTA grande em azul marinho (#003366) com texto "QUERO PROTEGER MEUS BENS"
- Efeito hover no botão (brilho/elevação)
- Validação básica dos campos
- Feedback visual ao enviar (loading + mensagem de sucesso)

**Frontend - Seção de Benefícios:**
- Grid de 3 colunas (1 coluna no mobile)
- Ícone 1 (Cadeado): "Cofre Digital" - máximo 2 linhas de explicação
- Ícone 2 (Sirene): "Alerta Real" - máximo 2 linhas de explicação
- Ícone 3 (Lupa): "Match de Recuperação: Cruzamos dados com itens encontrados para devolver o que é seu" - máximo 2 linhas
- Ícones minimalistas em azul marinho ou vermelho alerta

**Frontend - Rodapé:**
- Frase de impacto sobre segurança em Fortaleza
- Área com placeholders para logos de parceiros (3-4 logos fictícios em grayscale)
- Texto de copyright "CERC Fortaleza 2026"

**Design System:**
- Paleta de cores primária:
  - Azul Marinho: #003366 (títulos, botões, ícones)
  - Vermelho Alerta: #CC0000 (destaques, ícones de alerta)
  - Branco: #FFFFFF (fundos, cards)
  - Cinza Claro: #F5F5F5 (fundo hero)
- Tipografia: Inter ou Montserrat, hierarquia clara
- Abordagem mobile-first (100% responsivo)
- Sombras suaves para cards
- Espaçamento generoso entre seções

### Modify

N/A (projeto novo)

### Remove

N/A (projeto novo)

## Implementation Plan

1. **Backend (Motoko):**
   - Criar modelo de dados Lead com campos: id, nome, whatsapp, timestamp
   - Implementar função de cadastro que valida e armazena leads
   - Implementar função de listagem de leads (para futuro painel admin)

2. **Frontend - Estrutura:**
   - Criar componente App.tsx como landing page única
   - Implementar seções: Hero, FormularioConversao, Beneficios, Rodape
   - Configurar Tailwind com cores customizadas (azul marinho, vermelho alerta)
   - Adicionar fonte Inter ou Montserrat via Google Fonts

3. **Frontend - Hero Section:**
   - Implementar gradiente/fundo cinza claro
   - Adicionar imagem de mapa de Fortaleza com opacity-10
   - Criar headline impactante e subheadline
   - Logo CERC Fortaleza no topo

4. **Frontend - Formulário:**
   - Criar componente de formulário controlado (useState)
   - Integrar com backend para enviar leads
   - Adicionar validação (nome obrigatório, WhatsApp com máscara)
   - Implementar estados: inicial, loading, sucesso, erro
   - Estilizar com card branco + sombra + CTA azul marinho

5. **Frontend - Benefícios:**
   - Criar grid responsivo (3 colunas → 1 coluna mobile)
   - Adicionar ícones via Lucide React ou Hero Icons
   - Textos curtos e diretos (máximo 2 linhas cada)

6. **Frontend - Rodapé:**
   - Frase de impacto
   - Grid de logos de parceiros (placeholders em grayscale)
   - Copyright

7. **Validação:**
   - Verificar responsividade mobile-first
   - Testar envio de formulário
   - Build de produção sem erros

## UX Notes

- **Conversão em primeiro lugar:** O formulário é o elemento mais importante da página. Deve estar acima da dobra e com contraste máximo.
- **Clareza:** Evitar jargões técnicos. Usar linguagem simples e direta ("Proteger meus bens" ao invés de "Cadastrar no sistema").
- **Hierarquia visual:** Título → Formulário → Benefícios → Rodapé. O olho do usuário deve seguir essa ordem naturalmente.
- **Prova social implícita:** A seção de parceiros (mesmo com placeholders) transmite credibilidade.
- **Urgência sutil:** O vermelho alerta nos ícones reforça a necessidade de ação sem ser agressivo.
- **Mobile-first:** Maioria dos usuários acessará via celular. Touch targets grandes, inputs espaçados, texto legível sem zoom.
- **Performance:** Página leve e rápida. Imagem do mapa otimizada.
