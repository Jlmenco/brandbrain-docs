---
sidebar_position: 3
---

# Gestao de Influenciadores

O Brand Brain modela influenciadores como entidades centrais que determinam tom, estilo e contexto de marca para geracao de conteudo.

## Criando um Influenciador

O dialog de criacao (`CreateInfluencerDialog`) aceita os seguintes campos:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **Nome** | `string` | Nome do influenciador ou perfil |
| **Tipo** | `master` / `brand` | Master = perfil principal, Brand = marca derivada |
| **Nicho** | `string` | Area de atuacao (ex: tecnologia, saude, moda) |
| **Tom** | `string` | Tom de voz padrao (ex: profissional, descontraido, tecnico) |
| **Emoji** | `string` | Emoji representativo para identificacao visual |
| **Idioma** | `string` | Idioma principal do conteudo (ex: pt-BR) |
| **Estilo CTA** | `string` | Estilo padrao de call-to-action (ex: direto, sutil, interrogativo) |

### Tipos de Influenciador

- **Master**: Perfil raiz de um grupo. Representa a pessoa ou empresa principal.
- **Brand**: Marca ou sub-perfil vinculado a um master. Pode ter tom e nicho diferentes.

## Brand Kit

Cada influenciador possui um Brand Kit — um conjunto de informacoes que alimentam a IA na geracao de conteudo.

| Campo | Formato | Descricao |
|-------|---------|-----------|
| **Descricao** | Texto livre | Resumo geral da marca/influenciador |
| **Proposta de Valor** | JSON (lista) | Diferenciais e valores da marca |
| **Produtos** | JSON (lista) | Produtos ou servicos oferecidos |
| **Audiencia** | JSON (objeto) | Perfil do publico-alvo (idade, interesses, dores) |
| **Diretrizes de Estilo** | JSON (objeto) | Regras de linguagem, formatacao, palavras proibidas |
| **Links** | JSON (lista) | URLs relevantes (site, redes sociais, landing pages) |

O Brand Kit e editado via `EditBrandKitDialog` e atualizado via endpoint:

```
PUT /api/v1/influencers/{id}/brand-kit
```

## Embeddings para RAG

Ao salvar ou atualizar o Brand Kit, o sistema automaticamente:

1. Extrai o texto de todos os campos
2. Divide em chunks semanticos
3. Gera embeddings via `text-embedding-3-small` (1536 dimensoes)
4. Armazena na tabela `BrandKitEmbedding` com pgvector

Esses embeddings sao recuperados durante a geracao de conteudo para fornecer contexto de marca ao agente de IA. Veja a pagina [RAG + Embeddings](./rag) para mais detalhes.

## Permissoes

| Acao | Role Minima |
|------|-------------|
| Visualizar influenciadores | Viewer |
| Criar influenciador | Admin |
| Editar influenciador | Admin |
| Atualizar Brand Kit | Admin |
