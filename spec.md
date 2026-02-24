# CERC Fortaleza - Landing Page

## Current State
Landing page funcional com:
- Hero section com mapa de Fortaleza
- Logo CERC gerada (escudo azul/vermelho)
- Nome atual: "CERC Fortaleza"
- Formulário de cadastro (nome + WhatsApp)
- Seção de benefícios (3 cards)
- Rodapé com parceiros

## Requested Changes (Diff)

### Add
- Logo oficial do cliente (LOGO COM NOME.png) já uploadada em `/assets/uploads/LOGO-COM-NOME-1.png`

### Modify
- **Nome completo:** Alterar de "CERC Fortaleza" para "CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará"
- **Logo:** Substituir logo gerada atual pela logo oficial do cliente
- **Título do Hero:** Ajustar para incluir o nome completo da organização
- **Meta tags:** Atualizar título da página e description

### Remove
- Logo gerada anterior (substituída pela oficial)

## Implementation Plan

### Frontend Changes
1. **Hero Section:**
   - Substituir `<img src="/assets/generated/logo-cerc-fortaleza.dim_200x200.png">` por `<img src="/assets/uploads/LOGO-COM-NOME-1.png">`
   - Ajustar altura da logo para manter proporção (logo oficial é horizontal)
   - Atualizar alt text para nome completo
   - Revisar tamanho responsivo da logo

2. **Textos e Branding:**
   - Atualizar todas as menções de "CERC Fortaleza" para "CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará"
   - Meta tag `<title>`: "CERC FORTALEZA - Cadastro de Eletrônicos e Registros Ceará"
   - Hero heading: manter foco na proposta de valor (segurança), mas ajustar branding se necessário
   - Rodapé copyright: atualizar nome da organização

3. **Validação:**
   - Testar responsividade da logo oficial em mobile/tablet/desktop
   - Garantir contraste adequado da logo sobre o background
   - Validar build e typecheck

## UX Notes
- Logo oficial já inclui o nome completo, então não precisa texto adicional abaixo
- Manter hierarquia visual: logo → proposta de valor → formulário
- Logo horizontal pode exigir ajuste de largura (max-w-md ou similar) para não dominar o hero em desktop
