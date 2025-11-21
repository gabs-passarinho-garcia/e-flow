# Configuração de Deploy

## Deploy Condicional no Vercel

Para garantir que o deploy em production só aconteça após os checks do GitHub Actions passarem, você precisa configurar isso na interface web do Vercel:

### Passos para Configurar

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione o projeto **e-flow**
3. Vá em **Settings** → **Git**
4. Na seção **Production Branch**, configure:
   - **Production Branch**: `main`
   - **Wait for Build Checks**: ✅ Habilitado
   - **Required Build Checks**: Selecione `PR Quality Check` e `Deploy to Production`

### Como Funciona

- **PRs para main**: O workflow `pr-check.yml` executa e valida:
  - Type checking → Notifica Vercel: `Vercel - e-flow: type-check`
  - Linting → Notifica Vercel: `Vercel - e-flow: lint`
  - Format checking → Notifica Vercel: `Vercel - e-flow: format`
  - Testes unitários → Notifica Vercel: `Vercel - e-flow: test`

- **Commits em main**: O workflow `deploy-production.yml` executa:
  - Todas as validações do PR check (com notificações ao Vercel)
  - Build da aplicação → Notifica Vercel: `Vercel - e-flow: build`
  - Upload de artifacts

- **Vercel**: Só faz deploy em production se:
  - O commit está na branch `main`
  - Todos os status checks do GitHub passaram
  - O Vercel recebeu notificações de sucesso de todos os checks configurados
  - O build foi bem-sucedido

### Status Checks Necessários

Os workflows do GitHub Actions notificam automaticamente o Vercel sobre o status de cada check usando `vercel/repository-dispatch/actions/status@v1`. Os seguintes checks são enviados:

**Para PRs (pr-check.yml):**

- ✅ `Vercel - e-flow: type-check`
- ✅ `Vercel - e-flow: lint`
- ✅ `Vercel - e-flow: format`
- ✅ `Vercel - e-flow: test`

**Para commits em main (deploy-production.yml):**

- ✅ `Vercel - e-flow: type-check`
- ✅ `Vercel - e-flow: lint`
- ✅ `Vercel - e-flow: format`
- ✅ `Vercel - e-flow: test`
- ✅ `Vercel - e-flow: build`

Na interface do Vercel, você deve selecionar estes checks como **Required Build Checks** para que o deploy só aconteça após todos passarem.

### Nota Importante

A configuração de "Wait for Build Checks" é feita **apenas na interface web do Vercel**, não no arquivo `vercel.json`. Isso é uma limitação da plataforma Vercel.
