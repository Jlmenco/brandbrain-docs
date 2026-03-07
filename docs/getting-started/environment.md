---
sidebar_position: 3
---

# Variaveis de Ambiente

Referencia completa das variaveis de ambiente utilizadas pelo Brand Brain.

## Backend (API + Worker)

| Variavel                | Valor padrao                                  | Descricao                                                    |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`          | `postgresql+psycopg://user:pass@postgres/bb`  | String de conexao com o PostgreSQL (inclui pgvector)         |
| `REDIS_URL`             | `redis://redis:6379/0`                        | String de conexao com o Redis (cache + pub/sub)              |
| `APP_ENV`               | `local`                                       | Ambiente de execucao: `local`, `staging` ou `production`     |
| `AI_DEFAULT_PROVIDER`   | `mock`                                        | Provider de IA: `mock` (respostas simuladas) ou `openai`     |
| `AI_CONFIDENTIAL_MODE`  | `true`                                        | Quando `true`, sanitiza dados sensiveis antes de enviar a IA |
| `STORAGE_BASE_PATH`     | `/data/storage`                               | Diretorio base para armazenamento de arquivos                |

### Worker

| Variavel               | Valor padrao | Descricao                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------- |
| `WORKER_POLL_INTERVAL` | `30`         | Intervalo em segundos entre cada ciclo de poll do worker      |
| `WORKER_BATCH_SIZE`    | `10`         | Quantidade maxima de itens processados por ciclo              |
| `WORKER_MAX_RETRIES`   | `3`          | Numero maximo de tentativas antes de marcar como falha final  |

O Worker tambem utiliza `DATABASE_URL` e `REDIS_URL` com os mesmos valores da API.

## Frontend (Next.js)

| Variavel                    | Valor padrao              | Descricao                                     |
| --------------------------- | ------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`  | `http://localhost/api`    | URL base da API utilizada pelo frontend       |

:::tip
Variaveis prefixadas com `NEXT_PUBLIC_` sao expostas no bundle do cliente. Nunca coloque secrets nessas variaveis.
:::

## Exemplo de `.env`

```bash
# Banco de dados
DATABASE_URL=postgresql+psycopg://brandbrain:secret@postgres:5432/brandbrain

# Redis
REDIS_URL=redis://redis:6379/0

# Ambiente
APP_ENV=local

# IA
AI_DEFAULT_PROVIDER=mock
AI_CONFIDENTIAL_MODE=true

# Storage
STORAGE_BASE_PATH=/data/storage

# Worker
WORKER_POLL_INTERVAL=30
WORKER_BATCH_SIZE=10
WORKER_MAX_RETRIES=3

# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost/api
```

## Notas importantes

- **Porta do PostgreSQL**: o Docker Compose mapeia `5433:5432` para evitar conflito com instancias locais do PostgreSQL. Dentro da rede Docker, a porta interna continua sendo `5432`.
- **`AI_DEFAULT_PROVIDER=mock`**: no modo mock, os agentes de IA retornam respostas simuladas sem consumir creditos de API. Mude para `openai` quando estiver pronto para usar LLMs reais (requer `OPENAI_API_KEY`).
- **`APP_ENV=production`**: em producao, desabilita endpoints de debug e ativa configuracoes de seguranca adicionais.
