---
sidebar_position: 8
---

# RAG + Embeddings

O Brand Brain utiliza Retrieval-Augmented Generation (RAG) para enriquecer a geracao de conteudo com contexto especifico de cada marca.

## Visao Geral

Em vez de depender apenas do conhecimento geral da LLM, o sistema recupera trechos relevantes do Brand Kit do influenciador e os injeta no prompt. Isso garante que o conteudo gerado respeite a identidade da marca.

## Arquitetura

```
Brand Kit (texto) → Chunking → Embedding → pgvector
                                                ↓
Prompt de geracao ← Prompt Builder ← Busca por similaridade
                                                ↑
                                     Query do conteudo solicitado
```

## Componentes

### pgvector

Extensao do PostgreSQL que adiciona suporte a vetores e busca por similaridade. Habilitada na migration inicial:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### BrandKitEmbedding

Modelo que armazena os chunks vetorizados:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **id** | `UUID` | Identificador unico |
| **influencer_id** | `UUID` | Influenciador dono do Brand Kit |
| **chunk_text** | `string` | Texto original do chunk |
| **embedding** | `Vector(1536)` | Vetor de embedding |
| **chunk_index** | `int` | Posicao do chunk na sequencia |

### Embedding Service

O `embedding_service` e responsavel por:

1. **Extrair texto** de todos os campos do Brand Kit (descricao, proposta de valor, produtos, audiencia, diretrizes, links)
2. **Dividir em chunks** semanticos de tamanho adequado
3. **Gerar embeddings** via modelo `text-embedding-3-small` (1536 dimensoes)
4. **Armazenar** na tabela `BrandKitEmbedding`

O processo e disparado automaticamente ao salvar ou atualizar o Brand Kit (`PUT /influencers/{id}/brand-kit`).

### Prompt Builder

O `prompt_builder` monta o prompt final para o agente de IA:

1. Recebe o contexto da solicitacao (plataforma, tom, influenciador)
2. Gera um embedding da query
3. Busca os **top-K chunks** mais similares via cosine similarity no pgvector
4. Monta o prompt com o conteudo original + chunks recuperados + instrucoes

### Marketing Agent

O `generate_drafts` do Marketing Agent utiliza o prompt enriquecido pelo RAG para gerar conteudo que:

- Reflete a proposta de valor da marca
- Menciona produtos/servicos relevantes
- Fala para a audiencia correta
- Segue as diretrizes de estilo

## Pipeline Completo

```
1. Admin edita Brand Kit do influenciador
2. Sistema extrai texto → divide em chunks → gera embeddings
3. Embeddings armazenados no pgvector
4. Editor solicita geracao de conteudo
5. Prompt Builder busca chunks relevantes por similaridade
6. Chunks injetados no prompt do Marketing Agent
7. LLM gera conteudo contextualizado
8. Draft entra no workflow de revisao
```

## Configuracao

| Variavel | Descricao | Padrao |
|----------|-----------|--------|
| `AI_DEFAULT_PROVIDER` | Provider de IA (`mock` ou `openai`) | `mock` |
| `OPENAI_API_KEY` | Chave da API OpenAI (necessaria para embeddings reais) | — |
| `EMBEDDING_MODEL` | Modelo de embedding | `text-embedding-3-small` |
| `RAG_TOP_K` | Quantidade de chunks recuperados | `5` |
