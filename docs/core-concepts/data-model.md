---
sidebar_position: 4
---

# Modelo de Dados

O Brand Brain utiliza **PostgreSQL** com a extensao **pgvector** como banco de dados principal. O schema e composto por 16 tabelas que cobrem desde autenticacao e multi-tenancy ate rastreamento de metricas e embeddings para RAG.

## Diagrama de Relacionamentos

```
User ──────┐
           │ (OrgMember)
           ▼
Organization ───► CostCenter ───► ContentItem ◄─── Campaign
     │                                 │
     │                                 ▼
     │                           TrackingLink ───► Event
     │
     └───► Influencer ───► BrandKit ───► BrandKitEmbedding
                              │
                              ▼
                         MacroContent

User ───► Notification
User ───► AuditLog
CostCenter ───► Lead
ContentItem ───► MetricsDaily
```

## Entidades

### User

Representa um usuario do sistema. Pode pertencer a multiplas organizacoes.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| email | String (unique) | Email do usuario |
| name | String | Nome completo |
| hashed_password | String | Senha criptografada (bcrypt) |

### Organization

Entidade de nivel mais alto. Representa uma empresa ou grupo empresarial (tenant).

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| name | String | Nome da organizacao |
| slug | String (unique) | Slug para URLs |

### OrgMember

Tabela de vinculo entre usuarios e organizacoes, com a role atribuida.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| user_id | Integer (FK -> User) | ID do usuario |
| org_id | Integer (FK -> Organization) | ID da organizacao |
| role | String | Role: owner, admin, editor ou viewer |

### CostCenter

Subdivisao dentro de uma organizacao. Representa marcas, unidades de negocio ou departamentos.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| name | String | Nome do cost center |
| org_id | Integer (FK -> Organization) | Organizacao proprietaria |
| budget | Float | Orcamento alocado |

### Influencer

Persona ou perfil de marca que produz conteudo.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| name | String | Nome do influenciador |
| type | String | Tipo (ex: interno, externo, IA) |
| niche | String | Nicho de atuacao |
| tone | String | Tom de voz |
| emoji | String | Emoji representativo |
| language | String | Idioma principal |
| cta_style | String | Estilo de call-to-action |
| org_id | Integer (FK -> Organization) | Organizacao proprietaria |

### BrandKit

Diretrizes de marca associadas a um influenciador. Utilizado pelo RAG para contextualizar geracao de conteudo.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| influencer_id | Integer (FK -> Influencer, PK) | Influenciador associado |
| description | Text | Descricao geral da marca |
| value_props | JSON | Propostas de valor |
| products | JSON | Produtos e servicos |
| audience | JSON | Publico-alvo |
| style_guidelines | JSON | Guias de estilo visual e textual |
| links | JSON | Links relevantes (site, redes sociais) |

### Campaign

Campanha de marketing que agrupa conteudos relacionados.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| name | String | Nome da campanha |
| status | String | Status (active, paused, completed) |
| objective | String | Objetivo da campanha |
| org_id | Integer (FK -> Organization) | Organizacao proprietaria |

### ContentItem

Conteudo produzido no sistema. Unidade central do workflow de publicacao.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| title | String | Titulo do conteudo |
| body | Text | Corpo/texto do conteudo |
| platform | String | Plataforma destino (linkedin, instagram, etc.) |
| status | String | Status no workflow (draft, review, approved, scheduled, posted) |
| influencer_id | Integer (FK -> Influencer) | Influenciador autor |
| cost_center_id | Integer (FK -> CostCenter) | Cost center associado |
| campaign_id | Integer (FK -> Campaign, nullable) | Campanha associada (opcional) |

### MacroContent

Conteudo macro que pode ser redistribuido em multiplos conteudos menores para diferentes plataformas.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| topic | String | Topico do macro conteudo |
| body | Text | Corpo do conteudo macro |
| influencer_id | Integer (FK -> Influencer) | Influenciador associado |

### TrackingLink

Link curto com parametros UTM para rastreamento de cliques e conversoes.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| original_url | String | URL original de destino |
| short_code | String (unique) | Codigo curto gerado |
| utm_source | String | Parametro UTM source |
| utm_medium | String | Parametro UTM medium |
| utm_campaign | String | Parametro UTM campaign |
| utm_content | String | Parametro UTM content |
| utm_term | String | Parametro UTM term |

### Event

Evento de interacao registrado a partir de um tracking link.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| tracking_link_id | Integer (FK -> TrackingLink) | Link que gerou o evento |
| event_type | String | Tipo do evento (click, conversion, etc.) |
| ip | String | Endereco IP do visitante |
| user_agent | String | User agent do navegador |

### Lead

Contato comercial capturado atraves das campanhas de conteudo.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| name | String | Nome do lead |
| email | String | Email do lead |
| source | String | Origem (organico, pago, indicacao, etc.) |
| stage | String | Estagio no pipeline (new, qualified, converted, lost) |
| cost_center_id | Integer (FK -> CostCenter) | Cost center associado |

### MetricsDaily

Metricas diarias agregadas por conteudo publicado.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| content_item_id | Integer (FK -> ContentItem) | Conteudo associado |
| date | Date | Data da metrica |
| impressions | Integer | Numero de impressoes |
| likes | Integer | Numero de curtidas |
| comments | Integer | Numero de comentarios |
| shares | Integer | Numero de compartilhamentos |
| clicks | Integer | Numero de cliques |

### AuditLog

Registro de auditoria de todas as acoes executadas no sistema.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| user_id | Integer (FK -> User) | Usuario que executou a acao |
| action | String | Acao executada (create, update, approve, reject, etc.) |
| entity_type | String | Tipo da entidade afetada |
| entity_id | Integer | ID da entidade afetada |
| details | JSON | Detalhes adicionais da acao |

### Notification

Notificacao enviada a um usuario (in-app e/ou email).

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| user_id | Integer (FK -> User) | Usuario destinatario |
| title | String | Titulo da notificacao |
| body | Text | Corpo da notificacao |
| read | Boolean | Se foi lida |
| channel | String | Canal de envio (in_app, email) |

### BrandKitEmbedding

Embedding vetorial de trechos do brand kit, utilizado para busca semantica (RAG) na geracao de conteudo.

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Integer (PK) | Identificador unico |
| brand_kit_id | Integer (FK -> BrandKit) | Brand kit de origem |
| chunk_text | Text | Trecho de texto do brand kit |
| embedding | Vector(1536) | Vetor de embedding (text-embedding-3-small) |

## Extensao pgvector

O Brand Brain utiliza a extensao **pgvector** do PostgreSQL para armazenar e consultar embeddings vetoriais. A tabela `BrandKitEmbedding` armazena vetores de 1536 dimensoes gerados pelo modelo `text-embedding-3-small` da OpenAI.

A busca semantica e realizada via operador de distancia cosseno:

```sql
SELECT chunk_text
FROM brand_kit_embeddings
WHERE brand_kit_id = :kit_id
ORDER BY embedding <=> :query_embedding
LIMIT 5;
```

Isso permite que o Marketing Agent encontre os trechos mais relevantes do brand kit para contextualizar a geracao de conteudo.
