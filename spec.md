# CERC Fortaleza

## Current State
Aplicação completa com:
- Landing page com formulário de captação de leads
- App principal com 4 abas: Home (busca), Meu Baú, Recuperados, Guia SOS
- Painel administrativo com controle de usuários, senha admin1009
- Integração Stripe com links diretos de pagamento
- QR Code Pix para pagamento alternativo
- Política de privacidade
- Sistema de assinaturas (Gratuito / Premium Mensal / Premium Anual)
- Blob Storage disponível no backend

## Requested Changes (Diff)

### Add
- **Mapa de Calor de Ocorrências**: Nova aba "Mapa" no app principal (/app/mapa) exibindo um mapa visual SVG dos bairros de Fortaleza com intensidade de cor baseada no número de roubos registrados por bairro. Cada bairro clicável mostrando total de ocorrências, tipo mais comum de objeto roubado e botão para registrar ocorrência.
- Backend: novo campo `neighborhood` (bairro) no TheftInfo; nova função `getNeighborhoodStats()` retornando contagem por bairro; lista de 20 bairros principais de Fortaleza com dados iniciais simulados para fins de demonstração.
- Frontend: componente `HeatMapTab.tsx` com SVG interativo dos bairros, legenda de intensidade (verde→amarelo→vermelho), tooltip ao passar o mouse, painel lateral com ranking dos bairros mais perigosos.

### Modify
- `main.mo`: adicionar campo `neighborhood` opcional em TheftInfo; adicionar função `getNeighborhoodStats` pública; adicionar função `reportTheftWithNeighborhood` que inclui o bairro.
- `App.tsx`: adicionar rota `/app/mapa` com `HeatMapTab`
- `AppLayout.tsx`: adicionar item "Mapa" na barra de navegação inferior
- `SOSTab.tsx`: atualizar redirecionamento de B.O. online por estado

### Remove
- Nada

## Implementation Plan
1. Atualizar `main.mo` com TheftInfo expandido (neighborhood), getNeighborhoodStats(), lista de bairros com seed data de demonstração
2. Regenerar `backend.d.ts` via generate_motoko_code
3. Criar `HeatMapTab.tsx` com mapa SVG interativo dos bairros de Fortaleza
4. Registrar rota `/app/mapa` em `App.tsx`
5. Adicionar item "Mapa" no `AppLayout.tsx`
6. Build e deploy
