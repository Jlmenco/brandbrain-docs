---
sidebar_position: 1
---

# Quick Start

Guia rapido para subir o Brand Brain localmente e comecar a explorar a plataforma.

## Pre-requisitos

| Ferramenta      | Versao minima | Verificar                |
| --------------- | ------------- | ------------------------ |
| Docker          | 24+           | `docker --version`       |
| Docker Compose  | 2.20+         | `docker compose version` |
| Node.js         | 18+           | `node --version`         |

## Subindo o ambiente

### 1. Clonar o repositorio

```bash
git clone https://github.com/grupo-jlm/brandbrain-api.git
```

### 2. Subir os containers

```bash
cd brandbrain-api
docker compose -f infra/docker/compose.yml up -d --build
```

Isso sobe todos os servicos: PostgreSQL, Redis, API (FastAPI), Worker, Frontend (Next.js), Nginx, Prometheus, Loki e Grafana.

:::info
A porta 5432 pode conflitar com PostgreSQL local. O compose mapeia para **5433:5432** por padrao.
:::

### 3. Popular o banco (seed)

```bash
docker exec bb_api python -m app.scripts.seed
```

O seed cria usuarios, organizacao, centro de custo, influenciadores, conteudos, campanhas, leads, metricas e audit logs de demonstracao.

### 4. Acessar a plataforma

Abra o navegador e acesse `http://localhost`. A tela de login sera exibida.

## Credenciais de acesso

| Email                      | Senha      | Role   | Permissoes                          |
| -------------------------- | ---------- | ------ | ----------------------------------- |
| admin@brandbrain.dev       | admin123   | owner  | Acesso total (CRUD + aprovacao)     |
| editor@brandbrain.dev      | editor123  | editor | Criar e editar conteudos            |
| viewer@brandbrain.dev      | viewer123  | viewer | Somente leitura                     |

## URLs uteis

| Servico          | URL                          | Descricao                        |
| ---------------- | ---------------------------- | -------------------------------- |
| Frontend         | http://localhost              | Dashboard Next.js                |
| API (Swagger)    | http://localhost/api/docs     | Documentacao interativa da API   |
| Grafana          | http://localhost:3001         | Monitoramento e observabilidade  |

## Proximos passos

- Explore o [Dashboard](/docs/getting-started/architecture) para entender a arquitetura
- Configure as [variaveis de ambiente](/docs/getting-started/environment) para seu cenario
