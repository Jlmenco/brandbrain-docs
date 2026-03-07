---
sidebar_position: 5
---

# Gestao de Leads

O modulo de leads permite rastrear potenciais clientes gerados pelas campanhas de marketing.

## Estrutura

Cada lead possui:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **Nome** | `string` | Nome do lead |
| **Email** | `string` | Email de contato |
| **Telefone** | `string` (opcional) | Telefone de contato |
| **Estagio** | `enum` | Posicao no pipeline de vendas |
| **Fonte** | `enum` | Canal de origem do lead |
| **Centro de Custo** | `relacao` | Centro de custo vinculado |
| **Notas** | `string` (opcional) | Observacoes adicionais |

## Estagios do Pipeline

| Estagio | Descricao |
|---------|-----------|
| `novo` | Lead recem-capturado, sem qualificacao |
| `qualificado` | Lead validado com potencial de conversao |
| `proposta` | Proposta comercial enviada |
| `ganho` | Conversao realizada |
| `perdido` | Lead descartado ou perdido |

## Fontes de Aquisicao

| Fonte | Descricao |
|-------|-----------|
| `organic` | Busca organica ou conteudo nao pago |
| `paid` | Anuncios pagos (Google Ads, Meta Ads, etc.) |
| `referral` | Indicacao de outro cliente |
| `social` | Redes sociais (posts, stories, etc.) |

## Endpoints

```
GET    /api/v1/leads          # Listar leads (com paginacao)
POST   /api/v1/leads          # Criar lead
GET    /api/v1/leads/{id}     # Detalhe do lead
PUT    /api/v1/leads/{id}     # Atualizar lead
DELETE /api/v1/leads/{id}     # Remover lead
```

## Pipeline no Dashboard

O dashboard principal exibe uma visualizacao do pipeline com:

- Contagem de leads por estagio
- Barras proporcionais ao volume em cada fase
- Indicadores de conversao

## Interface

A pagina `/leads` oferece:

- Listagem com filtros por estagio e fonte
- Dialog de criacao/edicao
- Badges visuais para estagios e fontes
- Vinculacao ao centro de custo

## Permissoes

| Acao | Role Minima |
|------|-------------|
| Visualizar leads | Viewer |
| Criar lead | Editor |
| Editar lead | Editor |
| Remover lead | Admin |

## Seed de Demonstracao

O script de seed cria 8 leads distribuidos entre os diferentes estagios e fontes.
