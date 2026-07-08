# 🚀 Guia de Deploy — Cine Review

Guia completo para manter o código no GitHub, configurar o Supabase e colocar o projeto no ar.

## Arquitetura em produção

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Vercel         │      │  Railway/Render │      │  Supabase       │
│  movies-front   │ ───► │  movies-api     │ ───► │  PostgreSQL     │
│  (Next.js)      │      │  (NestJS)       │      │  (banco)        │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

| Serviço | Repositório | Onde hospedar |
|---------|-------------|---------------|
| Frontend | `movies-front` | **Vercel** |
| API | `movies-api` | **Railway** ou **Render** (NestJS precisa de servidor Node contínuo) |
| Banco | — | **Supabase** |

> A Vercel hospeda só o frontend. A API NestJS precisa de outro serviço (Railway/Render são os mais simples).

---

## 1. GitHub — o que commitar

### Repositórios

Mantenha **dois repositórios separados** (ou um monorepo, se preferir):

- `movies-api` — backend NestJS
- `movies-front` — frontend Next.js

### O que **deve** ir para o GitHub

```
✅ Código-fonte (src/)
✅ package.json e package-lock.json
✅ .env.example          ← template das variáveis (SEM valores reais)
✅ supabase/schema.sql   ← schema do banco
✅ scripts/seed.ts       ← script de popular dados
✅ Dockerfile            ← para deploy da API
✅ README.md e DEPLOY.md
```

### O que **NUNCA** deve ir para o GitHub

```
❌ .env
❌ .env.local
❌ node_modules/
❌ dist/ e .next/
❌ Senhas, JWT secrets, connection strings do Supabase
```

### Comandos para subir o código

**movies-api:**
```bash
cd movies-api
git init   # se ainda não tiver repo
git add .
git commit -m "feat: API pronta para produção com Supabase"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/movies-api.git
git push -u origin main
```

**movies-front:**
```bash
cd movies-front
git add .
git commit -m "feat: frontend com proxy API e integração Vercel"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/movies-front.git
git push -u origin main
```

---

## 2. Supabase — configurar o banco

### Passo 1: Criar projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. **New Project** → escolha nome, senha do banco e região (ex: `South America`)
3. Aguarde o projeto ficar pronto (~2 min)

### Passo 2: Criar as tabelas

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Cole todo o conteúdo do arquivo `supabase/schema.sql` do repositório `movies-api`
4. Clique em **Run**

### Passo 3: Obter a connection string

1. Vá em **Project Settings** (ícone de engrenagem) → **Database**
2. Em **Connection string**, selecione **URI**
3. Escolha o modo **Transaction** (porta 6543, pooler) — recomendado para servidores
4. Copie a URL e substitua `[YOUR-PASSWORD]` pela senha que você definiu ao criar o projeto

Exemplo:
```
postgresql://postgres.abcdefgh:SUASENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### Passo 4: Popular os dados (seed)

Na sua máquina local, com a API clonada:

```bash
cd movies-api
cp .env.example .env
```

Edite o `.env`:
```env
DATABASE_URL=postgresql://postgres.abcdefgh:SUASENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
DB_SSL=true
JWT_SECRET=gere-uma-chave-aleatoria-longa-aqui
JWT_REFRESH_SECRET=gere-outra-chave-aleatoria-longa-aqui
```

Gere chaves seguras:
```bash
openssl rand -base64 32
```

Rode o seed:
```bash
npm install
npm run seed        # básico: 8 filmes, 3 usuários
npm run seed:full   # completo: 28 filmes, 8 usuários (demo/portfolio)
```

### Credenciais de teste (após seed)

| Email | Senha | Papel |
|-------|-------|-------|
| admin@cine-review.com | admin12345 | admin |
| maria@cine-review.com | user12345 | usuário |
| joao@cine-review.com | user12345 | usuário |

### O que **não** precisa configurar no Supabase

- **Auth do Supabase** — o projeto usa JWT próprio na API NestJS
- **Storage** — posters usam URLs externas (TMDB)
- **Edge Functions** — não utilizadas
- **RLS (Row Level Security)** — a API controla acesso via JWT; RLS é opcional

---

## 3. API — deploy (Railway ou Render)

### Opção A: Railway (recomendado)

1. Acesse [railway.app](https://railway.app) e conecte com GitHub
2. **New Project** → **Deploy from GitHub repo** → selecione `movies-api`
3. Railway detecta o `Dockerfile` automaticamente
4. Vá em **Variables** e adicione:

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://postgres.[ref]:[senha]@...pooler.supabase.com:6543/postgres` |
| `DB_SSL` | `true` |
| `JWT_SECRET` | chave gerada com `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | outra chave gerada |
| `CORS_ORIGIN` | `https://seu-app.vercel.app` (preencha depois do deploy do frontend) |

5. Em **Settings** → **Networking** → **Generate Domain**
6. Anote a URL gerada (ex: `https://movies-api-production.up.railway.app`)

### Opção B: Render

1. Acesse [render.com](https://render.com) → **New** → **Web Service**
2. Conecte o repo `movies-api`
3. Configurações:
   - **Environment**: Docker
   - **Instance type**: Free (ou pago para sem sleep)
4. Adicione as mesmas variáveis de ambiente da tabela acima
5. Deploy → anote a URL (ex: `https://movies-api.onrender.com`)

### Testar a API

```bash
# Deve retornar erro 401 (rota protegida, API funcionando)
curl https://SUA-URL-API/movies

# Login
curl -X POST https://SUA-URL-API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@cine-review.com","password":"user12345"}'
```

Swagger disponível em: `https://SUA-URL-API/documentation`

---

## 4. Frontend — deploy na Vercel

### Passo 1: Conectar repositório

1. Acesse [vercel.com](https://vercel.com) e conecte com GitHub
2. **Add New Project** → selecione o repo `movies-front`
3. Framework detectado: **Next.js** (automático)

### Passo 2: Variáveis de ambiente

Em **Settings → Environment Variables**, adicione:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `API_URL` | `https://SUA-URL-API.railway.app` (ou Render) | Production, Preview, Development |

> `API_URL` é usada pelo proxy `/api/*` e pelas server actions de login. **Não** precisa de `NEXT_PUBLIC_` — a URL da API fica só no servidor.

### Passo 3: Deploy

1. Clique em **Deploy**
2. Anote a URL gerada (ex: `https://movies-front.vercel.app`)

### Passo 4: Atualizar CORS na API

Volte no Railway/Render e atualize a variável:

```
CORS_ORIGIN=https://movies-front.vercel.app
```

Se tiver domínio customizado, inclua ambos separados por vírgula:
```
CORS_ORIGIN=https://movies-front.vercel.app,https://cinereview.seudominio.com
```

A API reinicia automaticamente com a nova config.

---

## 5. Checklist final

```
□ Supabase: projeto criado
□ Supabase: schema.sql executado no SQL Editor
□ Supabase: seed rodado (npm run seed)
□ GitHub: movies-api publicado (sem .env)
□ GitHub: movies-front publicado (sem .env.local)
□ Railway/Render: API no ar com todas as env vars
□ Railway/Render: domínio público gerado
□ Vercel: frontend deployado com API_URL configurada
□ API: CORS_ORIGIN apontando para URL da Vercel
□ Teste: login com maria@cine-review.com / user12345
□ Teste: criar conta nova em /sign-up
□ Teste: listar filmes após login
□ Teste: abrir detalhe de um filme e enviar review
```

---

## 6. Variáveis de ambiente — referência rápida

### movies-api (Railway/Render)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NODE_ENV` | Sim | `production` |
| `PORT` | Não | Padrão `3000` |
| `DATABASE_URL` | Sim* | Connection string do Supabase |
| `DB_SSL` | Sim* | `true` quando usar Supabase |
| `JWT_SECRET` | Sim | Chave para access tokens |
| `JWT_REFRESH_SECRET` | Sim | Chave para refresh tokens |
| `CORS_ORIGIN` | Sim | URL do frontend na Vercel |

\* Use `DATABASE_URL` + `DB_SSL` para Supabase. Para banco local, use `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### movies-front (Vercel)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `API_URL` | Sim | URL pública da API (Railway/Render) |

---

## 7. Desenvolvimento local

```bash
# Terminal 1 — Banco (opcional, se não usar Supabase)
cd movies-api && docker compose up -d

# Terminal 2 — API
cd movies-api
cp .env.example .env   # edite JWT_SECRET e JWT_REFRESH_SECRET
npm install && npm run start:dev

# Terminal 3 — Seed (primeira vez)
cd movies-api && npm run seed

# Terminal 4 — Frontend
cd movies-front
cp .env.example .env.local
npm install && npm run dev
```

- Frontend: http://localhost:3001
- API: http://localhost:3000
- Swagger: http://localhost:3000/documentation

---

## 8. Problemas comuns

| Problema | Solução |
|----------|---------|
| Login funciona mas filmes não carregam | Verifique se `API_URL` na Vercel aponta para a API correta |
| Erro CORS no browser | Atualize `CORS_ORIGIN` na API com a URL exata da Vercel |
| API não conecta ao banco | Confirme `DATABASE_URL` e `DB_SSL=true` no Railway/Render |
| Seed falha no Supabase | Rode `schema.sql` no SQL Editor antes do seed |
| 401 em todas as rotas | JWT_SECRET diferente entre deploys — use a mesma chave |
| Render free "dorme" | Primeira requisição demora ~30s; considere Railway ou plano pago |

---

## 9. Domínio customizado (opcional)

**Vercel (frontend):**
1. **Settings → Domains** → adicione `cinereview.seudominio.com`
2. Configure o DNS conforme instruções da Vercel

**Railway (API):**
1. **Settings → Networking → Custom Domain** → `api.seudominio.com`
2. Atualize `API_URL` na Vercel e `CORS_ORIGIN` na API

**Portfolio (thiago-portfolio):**
Após deploy do frontend, atualize a URL `live` do projeto **Cine Review** em:
- `src/data/site-config.ts`
- `src/locales/pt.ts`
- `src/locales/en.ts`

Use a URL real da Vercel (ex: `https://movies-front.vercel.app`).

---

## Estrutura dos repositórios

```
movies-api/
├── src/                  # Código NestJS
├── supabase/schema.sql   # Schema para Supabase
├── scripts/seed.ts       # Popular banco
├── Dockerfile            # Deploy containerizado
├── .env.example          # Template de variáveis
└── DEPLOY.md             # Este guia

movies-front/
├── src/
│   ├── app/api/[...path] # Proxy para a API
│   └── app/actions/auth  # Login server-side
├── .env.example
└── DEPLOY.md             # Este guia
```
