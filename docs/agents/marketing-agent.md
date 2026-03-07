---
sidebar_position: 1
---

# Marketing Agent

O Marketing Agent e o agente de IA responsavel pela **geracao de conteudo** e **refinamento de brand kits** dentro do Brand Brain. Ele opera de forma autonoma, mas sempre com supervisao humana no loop de aprovacao.

## Objetivo

Automatizar a criacao de conteudo de marketing mantendo a consistencia com a voz e identidade da marca, utilizando o brand kit do influenciador como base contextual para todas as geracoes.

## Guardrails (Restricoes de Seguranca)

O Marketing Agent opera sob 6 restricoes fundamentais que garantem a seguranca e qualidade das operacoes:

| # | Guardrail                        | Descricao                                                                 |
|---|----------------------------------|---------------------------------------------------------------------------|
| 1 | **Human-in-the-loop**            | Toda geracao requer revisao humana antes de publicacao                     |
| 2 | **Sem publicacao sem aprovacao**  | Conteudo gerado entra como `draft` — nunca e publicado automaticamente    |
| 3 | **Compliance com brand voice**   | Todo conteudo gerado respeita o tom, estilo e diretrizes do brand kit     |
| 4 | **Auditoria completa**           | Todas as acoes do agente sao registradas nos logs de auditoria            |
| 5 | **Limites de geracao**           | Controle de volume para evitar uso excessivo de recursos de IA            |
| 6 | **Isolamento por organizacao**   | O agente opera estritamente dentro do escopo da organizacao do usuario    |

## Intents (Intencoes)

O agente responde a 6 intencoes distintas, cada uma com parametros e comportamentos especificos:

### 1. `create_influencer`

Cria um novo perfil de influenciador com base nas informacoes fornecidas.

**Parametros:** nome, tipo, nicho, tom de voz, idioma, CTA padrao

### 2. `refine_brand_kit`

Refina e atualiza o brand kit de um influenciador existente, otimizando propostas de valor, estilo e diretrizes.

**Parametros:** influencer_id, campos a refinar (value_props, style_guidelines, etc.)

### 3. `plan_week`

Gera um planejamento semanal de conteudo para um influenciador, distribuindo por plataformas e horarios otimizados.

**Parametros:** influencer_id, semana alvo, plataformas desejadas

### 4. `generate_drafts`

Gera rascunhos de conteudo para publicacao, utilizando RAG com embeddings do brand kit para contextualizar a geracao.

**Parametros:** influencer_id, plataforma, quantidade, tema/topico

### 5. `adapt_from_master`

Adapta um conteudo macro (master) para multiplas plataformas, ajustando formato, tom e tamanho conforme as especificidades de cada canal.

**Parametros:** macro_content_id, plataformas alvo

### 6. `prep_tracking`

Prepara links de rastreamento (short links + UTM) para os conteudos gerados, permitindo mensurar performance.

**Parametros:** content_item_ids, parametros UTM

## Ferramentas Internas

O agente dispoe de 12 ferramentas internas para executar suas operacoes:

| Ferramenta            | Descricao                                          |
|-----------------------|----------------------------------------------------|
| `get_influencer`      | Buscar dados de um influenciador                   |
| `get_brand_kit`       | Buscar brand kit do influenciador                  |
| `create_draft`        | Criar rascunho de conteudo                         |
| `update_brand_kit`    | Atualizar campos do brand kit                      |
| `list_content`        | Listar conteudos existentes                        |
| `get_metrics`         | Buscar metricas de performance                     |
| `create_tracking`     | Criar links de rastreamento                        |
| `search_brand_kit`    | Buscar contexto relevante via embeddings (RAG)     |
| `create_influencer`   | Criar novo influenciador                           |
| `get_macro_content`   | Buscar conteudo macro                              |
| `create_adaptation`   | Criar adaptacao de conteudo para plataforma        |
| `schedule_content`    | Agendar conteudo para publicacao                   |

## Input e Output

### Input (Request)

```json
{
  "org_id": "uuid",
  "cost_center_id": "uuid",
  "intent": "generate_drafts",
  "parameters": {
    "influencer_id": "uuid",
    "platform": "instagram",
    "count": 3,
    "topic": "lancamento do novo produto"
  }
}
```

### Output (Response)

```json
{
  "status": "success",
  "items": [
    {
      "type": "content_item",
      "id": "uuid",
      "title": "Titulo do conteudo gerado",
      "body": "Corpo do conteudo...",
      "platform": "instagram",
      "status": "draft"
    }
  ],
  "warnings": [
    "Brand kit nao possui style_guidelines definidos — usando padrao generico"
  ]
}
```

## Integracao com RAG

O Marketing Agent utiliza **Retrieval-Augmented Generation (RAG)** para contextualizar a geracao de conteudo:

1. **Embeddings do Brand Kit:** Quando um brand kit e criado ou atualizado, seus campos (value_props, products, audience, style_guidelines) sao convertidos em embeddings usando o modelo `text-embedding-3-small` (1536 dimensoes)
2. **Armazenamento:** Os embeddings sao armazenados na tabela `BrandKitEmbedding` utilizando a extensao `pgvector` do PostgreSQL
3. **Busca Semantica:** Na geracao de conteudo (intent `generate_drafts`), o agente realiza uma busca por similaridade coseno para encontrar o contexto mais relevante do brand kit
4. **Prompt Enrichment:** O contexto recuperado e injetado no prompt de geracao via `prompt_builder`, garantindo que o conteudo gerado esteja alinhado com a identidade da marca

### Fluxo do RAG

```
Topico do conteudo
    ↓
Embedding do topico (text-embedding-3-small)
    ↓
Busca por similaridade no pgvector (BrandKitEmbedding)
    ↓
Top-K chunks mais relevantes do brand kit
    ↓
Prompt = instrucoes + contexto RAG + topico
    ↓
LLM gera conteudo contextualizado
    ↓
Content item criado como draft
```

## Endpoint

```
POST /agents/marketing/generate
```

**Role necessaria:** owner, admin ou editor
