---
sidebar_position: 2
---

# Arquitetura

Visao geral da arquitetura do Brand Brain -- um sistema autonomo de inteligencia de marca (ABIS).

## Diagrama de alto nivel

```
                         +-------------------+
                         |    Navegador       |
                         |  (Next.js SPA)     |
                         +---------+---------+
                                   |
                                   v
                         +---------+---------+
                         |      Nginx        |
                         |  (reverse proxy)  |
                         +---------+---------+
                            /             \
                           v               v
              +-----------+--+       +-----+--------+
              |   Frontend   |       |   API        |
              |   Next.js 14 |       |   FastAPI    |
              +--------------+       +-----+--------+
                                        /     \
                                       v       v
                              +--------+  +----+----+
                              | Redis  |  |PostgreSQL|
                              +--------+  |(pgvector)|
                                          +----+-----+
                                               ^
                                               |
                                     +---------+---------+
                                     |      Worker       |
                                     |  (poll + pubsub)  |
                                     +-------------------+
```

**Fluxo**: O navegador acessa o frontend Next.js servido pelo Nginx. Requisicoes `/api/*` sao encaminhadas pelo Nginx para a API FastAPI. A API se comunica com PostgreSQL (dados + embeddings via pgvector) e Redis (cache + sinais). O Worker opera independentemente, consultando o banco para publicacoes agendadas e ouvindo sinais via Redis pub/sub.

## Componentes do backend

O backend e composto por 9 servicos principais:

| Componente               | Responsabilidade                                                        |
| ------------------------ | ----------------------------------------------------------------------- |
| **Auth Service**         | Autenticacao JWT (HS256), registro, login, validacao de token           |
| **Influencer Service**   | CRUD de influenciadores e seus Brand Kits                               |
| **Content Service**      | Criacao, edicao e maquina de estados de conteudos                       |
| **Redistribution Engine**| Recebe MacroContent e redistribui para multiplas plataformas/formatos   |
| **Scheduler**            | Agenda publicacoes futuras, gerencia fila de itens pendentes            |
| **Tracking Service**     | Short links, parametros UTM e rastreamento de eventos                   |
| **Analytics**             | Metricas diarias agregadas e visao geral de performance                 |
| **Marketing Agent**      | Agente de IA para geracao de drafts com RAG (embeddings do Brand Kit)   |
| **Market Agent**         | Agente de IA para analise de mercado e tendencias                       |

## Multi-tenancy e isolamento

O Brand Brain opera com isolamento multi-tenant atraves de tres niveis:

```
Organizacao (Organization)
  └── Centro de Custo (Cost Center)
       └── Usuarios (via OrgMember com roles)
```

- **Organization**: entidade raiz que agrupa todos os recursos
- **Cost Center**: subdivisao logica dentro da organizacao (departamento, marca, cliente)
- **OrgMember**: vincula um usuario a uma organizacao com um role especifico

### Roles e permissoes

| Role     | Descricao                                             |
| -------- | ----------------------------------------------------- |
| `owner`  | Acesso total, gerencia organizacao e membros          |
| `admin`  | Acesso total operacional (CRUD + aprovacoes)          |
| `editor` | Cria e edita conteudos, submete para revisao          |
| `viewer` | Somente leitura em todos os recursos                  |

O RBAC e aplicado tanto no backend (`check_role()`) quanto no frontend (`<Gate permission="...">` e `can()`).

## Fluxo de conteudo

O ciclo de vida de um conteudo segue uma maquina de estados:

```
  draft  ──>  review  ──>  approved  ──>  scheduled  ──>  posted
                │                                           │
                v                                           v
            rejected                                     failed
                                                      (retry com backoff)
```

1. **Criacao**: Editor cria um draft (manual ou via Marketing Agent com RAG)
2. **Revisao**: Editor submete para revisao; admin/owner avaliam
3. **Aprovacao**: Admin/owner aprovam ou rejeitam com feedback
4. **Agendamento**: Conteudo aprovado e agendado para uma data/hora futura
5. **Publicacao**: Worker coleta itens agendados e publica via provider (mock ou real)

O Worker utiliza `SELECT ... FOR UPDATE SKIP LOCKED` para operacao segura com multiplas instancias, retry com backoff exponencial (30s, 120s, 480s) e grava audit logs em cada tentativa.
