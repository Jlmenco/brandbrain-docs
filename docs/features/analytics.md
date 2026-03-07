---
sidebar_position: 6
---

# Analytics e Metricas

O Brand Brain coleta e exibe metricas de desempenho do conteudo publicado, permitindo analise de engajamento e alcance.

## Modelo MetricsDaily

Cada registro de metrica diaria armazena:

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **content_item_id** | `UUID` | Conteudo associado |
| **date** | `date` | Data da medicao |
| **impressions** | `int` | Visualizacoes totais |
| **likes** | `int` | Curtidas |
| **comments** | `int` | Comentarios |
| **shares** | `int` | Compartilhamentos |
| **clicks** | `int` | Cliques no link |
| **followers_delta** | `int` | Variacao de seguidores no dia |

## Dashboard com Recharts

O painel principal (`/dashboard`) utiliza a biblioteca Recharts para exibir:

### Grafico de Linha — Metricas Diarias
- Eixo X: datas (ultimos 30 dias)
- Eixo Y: impressoes, curtidas, cliques
- Linhas sobrepostas com legendas interativas

### Graficos de Barra
- **Status de conteudos**: quantidade por status (draft, review, approved, etc.)
- **Engajamento por plataforma**: comparativo entre redes sociais

### Cards de Resumo
- Total de impressoes no periodo
- Total de engajamento (likes + comments + shares)
- Taxa de cliques (CTR)
- Variacao de seguidores

## Endpoint de Overview

```
GET /api/v1/analytics/overview?org_id={id}&period=30d
```

Retorna metricas agregadas:

```json
{
  "total_impressions": 45200,
  "total_likes": 3100,
  "total_comments": 420,
  "total_shares": 890,
  "total_clicks": 1560,
  "followers_delta": 234,
  "daily": [...]
}
```

## Rastreamento UTM

Cada link de conteudo pode incluir parametros UTM para rastreamento de origem:

| Parametro | Descricao |
|-----------|-----------|
| `utm_source` | Origem do trafego (ex: instagram, linkedin) |
| `utm_medium` | Meio (ex: social, email, paid) |
| `utm_campaign` | Nome da campanha |
| `utm_content` | Identificador do conteudo |
| `utm_term` | Termo ou variacao (opcional) |

Os short links gerados pelo sistema embutem automaticamente os parametros UTM e registram eventos de clique para alimentar as metricas.

## Seed de Demonstracao

O script de seed gera 88 registros de `MetricsDaily` distribuidos ao longo de 30 dias, simulando metricas realistas para validacao do dashboard.
