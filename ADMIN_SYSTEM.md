# CERC FORTALEZA - Sistema Administrativo

## Visão Geral

Sistema completo de landing page com painel administrativo para o CERC FORTALEZA (Cadastro de Eletrônicos e Registros Ceará).

## Funcionalidades Implementadas

### 1. Landing Page Pública (`/`)
- Formulário de cadastro de leads (Nome + WhatsApp)
- Seção de benefícios (Cofre Digital, Alerta Real, Match de Recuperação)
- Design responsivo com paleta azul marinho e vermelho alerta
- Link para área administrativa no canto superior direito

### 2. Sistema de Autenticação
- **Login via Internet Identity** (blockchain ICP)
- Autenticação descentralizada e segura
- Verificação automática de permissões de administrador
- Persistência de sessão

### 3. Painel Administrativo (`/admin`)
**Acesso protegido - apenas administradores**

#### Cards de Estatísticas
- Total de Cadastros
- Cadastros Hoje
- Cadastros Esta Semana

#### Tabela de Leads
- Visualização completa: Nome, WhatsApp (formatado), Data/Hora
- Busca em tempo real por nome ou telefone
- Design responsivo: tabela desktop, cards mobile
- Loading states e mensagens de estado vazio

#### Header Administrativo
- Logo CERC FORTALEZA
- Botão "Voltar ao Site"
- Botão "Sair" (logout)

## Estrutura de Rotas

```
/           → Landing Page (pública)
/login      → Página de Login (Internet Identity)
/admin      → Painel Administrativo (protegido)
```

## Arquitetura Técnica

### Frontend
- **React 19** + **TypeScript**
- **TanStack Router** para roteamento
- **TanStack React Query** para gerenciamento de estado server
- **shadcn/ui** para componentes
- **Tailwind CSS** para estilização

### Backend (Motoko - ICP)
- `submitLead(name, whatsapp)` → cadastro público
- `getAllLeads()` → lista todos os leads (admin)
- `getStats()` → estatísticas (admin)
- `isCallerAdmin()` → verifica se usuário é admin
- `getCallerUserRole()` → retorna role do usuário

### Contextos
- **AuthContext**: gerencia estado de autenticação
  - `isAuthenticated`: boolean
  - `isAdmin`: boolean
  - `userRole`: admin | user | guest
  - `login()`: inicia login via II
  - `logout()`: limpa sessão

### Componentes Principais
- `LandingPage.tsx` → página inicial
- `LoginPage.tsx` → página de login
- `AdminPanel.tsx` → dashboard administrativo
- `ProtectedRoute.tsx` → wrapper de rota protegida
- `AuthContext.tsx` → contexto de autenticação

### Hooks Customizados
- `useAuth()` → acesso ao contexto de autenticação
- `useSubmitLead()` → mutation para cadastro
- `useGetAllLeads()` → query para listar leads
- `useGetStats()` → query para estatísticas
- `useIsAdmin()` → query para verificar admin

## Fluxo de Autenticação

1. Usuário clica em "Área do Administrador" na landing page
2. É redirecionado para `/login`
3. Clica em "Entrar com Internet Identity"
4. Popup de autenticação Internet Identity abre
5. Após autenticação, sistema verifica permissões via `isCallerAdmin()`
6. Se admin: redireciona para `/admin`
7. Se não admin: mostra mensagem "Acesso Negado"
8. Se não autenticado: mantém em `/login`

## Segurança

- **Rotas protegidas**: AdminPanel só acessível por admins autenticados
- **Verificação dupla**: ProtectedRoute + backend validation
- **Sessão segura**: Internet Identity com delegação de 30 dias
- **Sem senhas**: autenticação descentralizada via blockchain

## Design System

### Paleta de Cores
- **Primary**: Azul Marinho (`hsl(214 80% 25%)`)
- **Accent**: Vermelho Alerta (`hsl(0 84% 45%)`)
- **Background/Foreground**: Branco/Preto com variações

### Tipografia
- **Display**: Archivo Black (títulos)
- **Body**: IBM Plex Sans (texto)

### Componentes shadcn/ui Utilizados
- Card, Button, Input, Label
- Table, Skeleton
- Toaster (notificações)

## Como Testar

### 1. Testar Landing Page
- Acesse `/`
- Preencha nome e WhatsApp
- Submeta o formulário
- Verifique toast de sucesso

### 2. Testar Login
- Clique em "Área do Administrador"
- Clique em "Entrar com Internet Identity"
- Complete o fluxo de autenticação

### 3. Testar Painel Admin
- Após login bem-sucedido, você estará em `/admin`
- Visualize as estatísticas
- Veja a lista de leads cadastrados
- Teste a busca por nome ou telefone
- Clique em "Sair" para fazer logout

## Validações Realizadas

✅ TypeScript check: sem erros  
✅ ESLint: sem erros críticos (apenas warnings em arquivos gerados)  
✅ Build: bem-sucedido  
✅ Rotas: todas funcionais  
✅ Autenticação: Internet Identity integrado  
✅ Proteção: rotas admin protegidas  
✅ Responsividade: mobile e desktop

## Próximos Passos Sugeridos

1. **Promover primeiro admin**: Usar `promoteToAdmin(principal)` via backend
2. **Exportar dados**: Adicionar botão para download CSV
3. **Filtros avançados**: Data range, status, etc
4. **Notificações**: Push notifications para novos leads
5. **Analytics**: Gráficos de conversão e crescimento

## Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm --filter '@caffeine/template-frontend' start

# Build
pnpm --filter '@caffeine/template-frontend' build:skip-bindings

# Testes
pnpm --filter '@caffeine/template-frontend' typescript-check
pnpm --filter '@caffeine/template-frontend' lint
```

## Estrutura de Arquivos

```
src/frontend/src/
├── App.tsx                      # Router setup
├── contexts/
│   └── AuthContext.tsx          # Context de autenticação
├── pages/
│   ├── LandingPage.tsx          # Página inicial
│   ├── LoginPage.tsx            # Página de login
│   └── AdminPanel.tsx           # Painel administrativo
├── components/
│   └── ProtectedRoute.tsx       # Wrapper de proteção
├── hooks/
│   ├── useQueries.ts            # React Query hooks
│   ├── useActor.ts              # Actor hook (gerado)
│   └── useInternetIdentity.ts   # II hook (gerado)
└── backend.d.ts                 # Types do backend
```

## Observações Importantes

- **NÃO modificar** arquivos em `src/frontend/src/components/ui/*` (shadcn/ui)
- **NÃO modificar** `useActor.ts` e `useInternetIdentity.ts` (gerados)
- Landing page mantém funcionalidade original intacta
- Todas as validações passaram com sucesso
- Sistema pronto para produção

## Suporte

Para dúvidas sobre Internet Identity, consulte: https://internetcomputer.org/docs/current/developer-docs/identity/internet-identity/integrate-internet-identity

---

**Built with ❤️ using [caffeine.ai](https://caffeine.ai)**
