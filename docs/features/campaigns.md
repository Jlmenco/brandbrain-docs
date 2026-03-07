---
sidebar_position: 4
---

# Campanhas

O modulo de campanhas permite organizar conteudos em torno de objetivos de marketing especificos.

## Estrutura

Cada campanha possui:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **Nome** | `string` | Nome identificador da campanha |
| **Descricao** | `string` | Descricao do objetivo e escopo |
| **Status** | `enum` | Estado atual da campanha |
| **Objetivo** | `string` | Meta principal (ex: lancamento, awareness, conversao) |
| **Data inicio** | `datetime` | Inicio planejado |
| **Data fim** | `datetime` | Fim planejado |
| **Conteudos** | `relacao` | Itens de conteudo vinculados |

## Status

As campanhas seguem os seguintes estados:

| Status | Descricao |
|--------|-----------|
| `draft` | Campanha em planejamento, ainda nao ativa |
| `active` | Campanha em andamento, conteudos sendo publicados |
| `paused` | Campanha temporariamente pausada |
| `completed` | Campanha finalizada |

## CRUD

Os endpoints disponiveis:

```
GET    /api/v1/campaigns          # Listar campanhas
POST   /api/v1/campaigns          # Criar campanha
GET    /api/v1/campaigns/{id}     # Detalhe da campanha
PUT    /api/v1/campaigns/{id}     # Atualizar campanha
DELETE /api/v1/campaigns/{id}     # Remover campanha
```

## Interface

A pagina `/campanhas` no frontend oferece:

- Listagem com status visual (badges coloridos)
- Dialog de criacao com todos os campos
- Edicao inline
- Vinculacao de conteudos existentes

## Dashboard

O painel principal exibe um card de **Campanhas Ativas** com:

- Quantidade de campanhas em andamento
- Progresso (conteudos publicados vs. total)
- Proximas datas de encerramento

## Permissoes

| Acao | Role Minima |
|------|-------------|
| Visualizar campanhas | Viewer |
| Criar campanha | Editor |
| Editar campanha | Editor |
| Remover campanha | Admin |

## Seed de Demonstracao

O script de seed cria 4 campanhas de exemplo com diferentes status para facilitar a validacao do sistema.
