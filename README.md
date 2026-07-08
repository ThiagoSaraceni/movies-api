# Cine Review API

Backend NestJS do [Cine Review](../movies-front) — plataforma estilo Letterboxd para descobrir filmes, avaliar e escrever reviews.

O frontend é **mobile-first**; esta API expõe os endpoints consumidos pelo app (catálogo, reviews, auth).

## Stack

- NestJS 11 + TypeScript
- PostgreSQL (Docker local ou Supabase em produção)
- Sequelize ORM + JWT (access + refresh tokens)
- Swagger em `/documentation`

## Setup rápido

```bash
cp .env.example .env          # preencha JWT e banco (veja .env.example)
npm install
npm run start:dev             # http://localhost:3000
npm run seed                  # ou npm run seed:full para mais dados
```

Guia Supabase/WSL/deploy: **[DEPLOY.md](./DEPLOY.md)**

## Seeds

| Comando | Conteúdo |
|---------|----------|
| `npm run seed` | 8 filmes, 3 usuários, 6 reviews |
| `npm run seed:full` | 28 filmes, 8 usuários, 40+ reviews (ideal para demo) |

Ambos são idempotentes — podem rodar de novo sem duplicar gêneros/usuários.

## Como o projeto funciona

### Papéis (roles)

| Role | O que pode fazer |
|------|------------------|
| **user** | Ver filmes, buscar, escrever/editar a própria review |
| **admin** | Tudo que o user faz + criar usuários via API |

### O que o usuário faz no app (frontend)

- Cadastro (`/sign-up`) e login
- Navegar catálogo com busca e paginação
- Ver detalhe do filme (sinopse, gêneros, poster)
- Ler reviews de outros usuários
- Avaliar (1–5 estrelas) e escrever review (uma por filme, upsert)

### Funcionalidades só no Swagger (sem tela no app)

Estes endpoints existem e funcionam, mas **não têm interface no frontend** — use `http://localhost:3000/documentation`:

| Ação | Endpoint | Quem pode (hoje) |
|------|----------|------------------|
| Cadastrar filme | `POST /movies` | Qualquer usuário logado* |
| Editar filme | `PATCH /movies/:id` | Qualquer usuário logado* |
| Excluir filme | `DELETE /movies/:id` | Qualquer usuário logado* |
| Cadastrar gênero | `POST /genres` | Qualquer usuário logado |
| Criar usuário | `POST /users` | Somente **admin** |

\*Há TODO no código para restringir mutações de filmes a admin.

**Como testar no Swagger:** `Authorize` → login via `POST /auth/login` → copie o `accessToken` → cole no campo Bearer.

Para popular o catálogo sem Swagger, use `npm run seed` ou `npm run seed:full`.

### Autenticação

- JWT access token (15 min) + refresh token (7 dias)
- Login e register são públicos (`POST /auth/login`, `POST /auth/register`)
- Demais rotas exigem token

### Banco

- Supabase = apenas PostgreSQL (sem Auth/Storage do Supabase)
- No WSL use o **pooler** (`aws-*-*.pooler.supabase.com:6543`), não `db.*.supabase.co`

## Credenciais de teste

| Email | Senha | Role |
|-------|-------|------|
| admin@cine-review.com | admin12345 | admin |
| maria@cine-review.com | user12345 | user |
| joao@cine-review.com | user12345 | user |

Com `seed:full`, também: ana, pedro, carla, lucas, julia @cine-review.com / user12345

## Endpoints principais

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/register` | Público | Criar conta |
| POST | `/auth/login` | Público | Login |
| POST | `/auth/refresh` | Público | Renovar token |
| GET | `/movies` | JWT | Listar (paginação + busca) |
| GET | `/movies/:id` | JWT | Detalhe |
| POST | `/movies` | JWT | Criar filme |
| POST | `/movie-reviews` | JWT | Criar/atualizar review |
| GET | `/movie-reviews/:movie_id` | JWT | Reviews + média |
| GET | `/genres` | JWT | Listar gêneros |
| POST | `/users` | JWT + admin | Criar usuário |

## Variáveis de ambiente

Veja `.env.example`.

## Deploy

**[DEPLOY.md](./DEPLOY.md)**
