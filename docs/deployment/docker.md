---
sidebar_position: 1
---

# Deploy com Docker

O Brand Brain utiliza Docker Compose para orquestrar todos os servicos necessarios em desenvolvimento e producao.

## Servicos

O `compose.yml` define 9 servicos:

| Servico | Imagem | Descricao |
|---------|--------|-----------|
| **postgres** | `pgvector/pgvector:pg16` | Banco de dados com extensao pgvector |
| **redis** | `redis:7-alpine` | Cache e mensageria (pub/sub) |
| **api** | Build local | Backend FastAPI |
| **worker** | Build local | Worker de publicacao |
| **web** | Build local | Frontend Next.js |
| **nginx** | `nginx:alpine` | Reverse proxy e roteamento |
| **prometheus** | `prom/prometheus` | Coleta de metricas |
| **loki** | `grafana/loki` | Agregacao de logs |
| **grafana** | `grafana/grafana` | Dashboards de monitoramento |

## Portas

| Servico | Porta Host | Porta Container | Observacao |
|---------|-----------|----------------|------------|
| nginx | `80` | `80` | Ponto de entrada principal |
| postgres | `5433` | `5432` | Mapeado para 5433 para evitar conflito com PostgreSQL local |
| redis | `6379` | `6379` | — |
| api | `8000` | `8000` | Acesso direto (debug) |
| web | `3000` | `3000` | Acesso direto (debug) |
| prometheus | `9090` | `9090` | — |
| loki | `3100` | `3100` | — |
| grafana | `3001` | `3000` | Mapeado para 3001 para evitar conflito com Next.js |

## Comandos Essenciais

```bash
# Subir todos os servicos
docker compose up -d

# Ver logs de um servico
docker compose logs -f api

# Rodar seed de dados
docker exec bb_api python -m app.scripts.seed

# Rodar migrations
docker exec bb_api alembic upgrade head

# Rodar testes da API
docker exec -w /app bb_api python -m pytest tests/ -v --tb=short

# Rodar testes do Worker
docker exec -w /app bb_worker python -m pytest tests/ -v --tb=short

# Parar tudo
docker compose down
```

## Volumes

| Volume | Montagem | Descricao |
|--------|----------|-----------|
| `pg_data` | `/var/lib/postgresql/data` | Dados persistentes do PostgreSQL |
| `redis_data` | `/data` | Dados persistentes do Redis |
| `grafana_data` | `/var/lib/grafana` | Dashboards e configuracoes do Grafana |
| `loki_data` | `/loki` | Dados de logs do Loki |

## Health Checks

Os servicos possuem health checks configurados:

- **postgres**: `pg_isready -U brandbrain`
- **redis**: `redis-cli ping`
- **api**: `curl -f http://localhost:8000/health`

Os servicos dependentes (`api`, `worker`) aguardam os health checks de `postgres` e `redis` antes de iniciar.

## Rede

Todos os servicos compartilham a rede `bb_network` (bridge). O nginx roteia:

- `/api/*` → servico `api` (porta 8000)
- `/*` → servico `web` (porta 3000)
