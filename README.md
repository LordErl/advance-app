# AdvanceApp

Plataforma de gerenciamento de adiantamentos e despesas para empresas, desenvolvida com Next.js 14 e Supabase.

## Tecnologias

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)

## Estrutura do Projeto

O projeto segue a estrutura de diretórios do Next.js 14 com o padrão App Router:

```
/app
  /(app)             # Rotas autenticadas
    /dashboard       # Dashboard principal
    /advances        # Gerenciamento de adiantamentos
    /expenses        # Gerenciamento de despesas
    /profile         # Perfil do usuário
    /settings        # Configurações do usuário
    layout.tsx       # Layout para área autenticada
  /(auth)            # Rotas de autenticação
    /login           # Página de login
    /register        # Página de registro
    layout.tsx       # Layout para área de autenticação
  /components        # Componentes reutilizáveis
  /lib               # Utilitários e configurações
    /utils           # Funções utilitárias
  /stores            # Stores de estado global
  error.tsx          # Página de erro global
  loading.tsx        # Página de carregamento global
  not-found.tsx      # Página 404
  layout.tsx         # Layout raiz
  page.tsx           # Página inicial
```

## Requisitos

- Node.js 18.17 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/advance-app.git
cd advance-app
```

2. Instale as dependências
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas credenciais do Supabase e outras configurações necessárias.

4. Execute o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador

## Deploy no Vercel

A maneira mais fácil de fazer o deploy do AdvanceApp é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js).

1. Faça push do seu código para um repositório Git (GitHub, GitLab, Bitbucket)
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente no painel do Vercel
4. Deploy!

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
