---
sidebar_position: 2
---

# Referencia de Endpoints

Referencia completa de todos os endpoints da API do Brand Brain, organizados por dominio. Cada tabela indica o metodo HTTP, o caminho, a descricao e o papel (role) minimo necessario para acesso.

## Roles do Sistema

| Role     | Descricao                                      |
|----------|-------------------------------------------------|
| `owner`  | Proprietario da organizacao — acesso total      |
| `admin`  | Administrador — acesso total                    |
| `editor` | Editor — pode criar e editar conteudos          |
| `viewer` | Visualizador — somente leitura                  |

---

## Auth

Endpoints de autenticacao e informacoes do usuario logado.

| Metodo | Endpoint         | Descricao                         | Role Necessaria |
|--------|------------------|-----------------------------------|-----------------|
| POST   | `/auth/register` | Registrar novo usuario            | Publico         |
| POST   | `/auth/login`    | Login e obtencao do token JWT     | Publico         |
| GET    | `/auth/me`       | Retorna dados do usuario logado   | Autenticado     |

---

## Organizations

Gerenciamento de organizacoes (workspaces).

| Metodo | Endpoint      | Descricao                          | Role Necessaria |
|--------|---------------|------------------------------------|-----------------|
| GET    | `/orgs`       | Listar organizacoes do usuario     | Autenticado     |
| POST   | `/orgs`       | Criar nova organizacao             | Autenticado     |
| GET    | `/orgs/{id}`  | Obter detalhes da organizacao      | Autenticado     |
| PATCH  | `/orgs/{id}`  | Atualizar organizacao              | owner, admin    |

---

## Cost Centers

Centros de custo vinculados a uma organizacao.

| Metodo | Endpoint                         | Descricao                          | Role Necessaria |
|--------|----------------------------------|------------------------------------|-----------------|
| GET    | `/orgs/{org_id}/cost-centers`    | Listar centros de custo da org     | Autenticado     |
| POST   | `/orgs/{org_id}/cost-centers`    | Criar centro de custo              | owner, admin    |
| GET    | `/cost-centers/{id}`             | Obter detalhes do centro de custo  | Autenticado     |
| PATCH  | `/cost-centers/{id}`             | Atualizar centro de custo          | owner, admin    |

---

## Influencers

Gerenciamento de influenciadores e seus brand kits.

| Metodo | Endpoint                        | Descricao                           | Role Necessaria |
|--------|---------------------------------|-------------------------------------|-----------------|
| GET    | `/influencers`                  | Listar influenciadores              | Autenticado     |
| POST   | `/influencers`                  | Criar influenciador                 | owner, admin    |
| GET    | `/influencers/{id}`             | Obter detalhes do influenciador     | Autenticado     |
| PATCH  | `/influencers/{id}`             | Atualizar influenciador             | owner, admin    |
| PUT    | `/influencers/{id}/brand-kit`   | Criar/atualizar brand kit           | owner, admin    |

---

## Content Items

Gerenciamento de conteudos com workflow completo de aprovacao.

| Metodo | Endpoint                                    | Descricao                          | Role Necessaria |
|--------|---------------------------------------------|------------------------------------|-----------------|
| GET    | `/content-items`                            | Listar conteudos (paginado, busca) | Autenticado     |
| POST   | `/content-items`                            | Criar novo conteudo (rascunho)     | owner, admin, editor |
| GET    | `/content-items/{id}`                       | Obter detalhes do conteudo         | Autenticado     |
| PATCH  | `/content-items/{id}`                       | Atualizar conteudo                 | owner, admin, editor |
| POST   | `/content-items/{id}/submit-review`         | Enviar para revisao                | owner, admin, editor |
| POST   | `/content-items/{id}/approve`               | Aprovar conteudo                   | owner, admin    |
| POST   | `/content-items/{id}/request-changes`       | Solicitar alteracoes               | owner, admin    |
| POST   | `/content-items/{id}/reject`                | Rejeitar conteudo                  | owner, admin    |
| POST   | `/content-items/{id}/schedule`              | Agendar publicacao                 | owner, admin    |
| POST   | `/content-items/{id}/publish-now`           | Publicar imediatamente             | owner, admin    |

### Workflow de Status

```
draft → review → approved → scheduled → posted
                ↘ changes_requested → draft
                ↘ rejected
```

---

## Macro Content

Conteudo macro (master) e redistribuicao para multiplas plataformas.

| Metodo | Endpoint                               | Descricao                               | Role Necessaria      |
|--------|----------------------------------------|-----------------------------------------|----------------------|
| GET    | `/macro-contents`                      | Listar conteudos macro                  | Autenticado          |
| POST   | `/macro-contents`                      | Criar conteudo macro                    | owner, admin, editor |
| POST   | `/macro-contents/{id}/redistribute`    | Redistribuir para plataformas           | owner, admin, editor |

---

## Campaigns

Gerenciamento de campanhas de marketing.

| Metodo | Endpoint          | Descricao                  | Role Necessaria      |
|--------|-------------------|----------------------------|----------------------|
| GET    | `/campaigns`      | Listar campanhas           | Autenticado          |
| POST   | `/campaigns`      | Criar campanha             | owner, admin, editor |
| GET    | `/campaigns/{id}` | Obter detalhes da campanha | Autenticado          |
| PATCH  | `/campaigns/{id}` | Atualizar campanha         | owner, admin         |

---

## Leads

Gerenciamento de leads capturados.

| Metodo | Endpoint      | Descricao                | Role Necessaria      |
|--------|---------------|--------------------------|----------------------|
| GET    | `/leads`      | Listar leads             | Autenticado          |
| POST   | `/leads`      | Criar lead               | owner, admin, editor |
| GET    | `/leads/{id}` | Obter detalhes do lead   | Autenticado          |
| PATCH  | `/leads/{id}` | Atualizar lead           | owner, admin, editor |

---

## Tracking

Links encurtados, redirecionamento e rastreamento de eventos.

| Metodo | Endpoint            | Descricao                                  | Role Necessaria      |
|--------|---------------------|--------------------------------------------|----------------------|
| POST   | `/tracking/links`   | Criar link encurtado com UTM               | owner, admin, editor |
| GET    | `/t/{short_code}`   | Redirecionar link encurtado (302)          | Publico              |
| POST   | `/tracking/events`  | Registrar evento de rastreamento           | Publico              |

---

## Metrics

Metricas e analytics de performance.

| Metodo | Endpoint                                 | Descricao                              | Role Necessaria |
|--------|------------------------------------------|----------------------------------------|-----------------|
| GET    | `/metrics/overview?org_id={org_id}`      | Visao geral de metricas da organizacao | Autenticado     |
| GET    | `/metrics/daily?content_item_id={id}`    | Metricas diarias de um conteudo        | Autenticado     |

---

## Audit Logs

Logs de auditoria de acoes no sistema.

| Metodo | Endpoint       | Descricao                                    | Role Necessaria |
|--------|----------------|----------------------------------------------|-----------------|
| GET    | `/audit-logs`  | Listar logs de auditoria (filtros, paginacao) | Autenticado     |

---

## Notifications

Notificacoes in-app para o usuario.

| Metodo | Endpoint                      | Descricao                          | Role Necessaria |
|--------|-------------------------------|------------------------------------|-----------------|
| GET    | `/notifications`              | Listar notificacoes do usuario     | Autenticado     |
| PATCH  | `/notifications`              | Atualizar notificacoes (ex: marcar todas como lidas) | Autenticado     |
| POST   | `/notifications/{id}/read`    | Marcar notificacao como lida       | Autenticado     |

---

## Agents

Endpoints dos agentes de IA.

| Metodo | Endpoint                       | Descricao                                  | Role Necessaria      |
|--------|---------------------------------|--------------------------------------------|----------------------|
| POST   | `/agents/marketing/generate`   | Gerar conteudo via Marketing Agent         | owner, admin, editor |
| POST   | `/agents/market/analyze`       | Analisar mercado via Market Intelligence   | Autenticado          |

---

## Parametros Comuns

### Paginacao

Endpoints de listagem suportam paginacao via query parameters:

| Parametro | Tipo | Padrao | Descricao              |
|-----------|------|--------|------------------------|
| `skip`    | int  | 0      | Numero de itens a pular |
| `limit`   | int  | 20     | Quantidade de itens     |

### Filtros

Endpoints de listagem podem aceitar filtros adicionais como query parameters, como `search`, `status`, `org_id`, e `cost_center_id`, dependendo do recurso.
