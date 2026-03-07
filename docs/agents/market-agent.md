---
sidebar_position: 2
---

# Market Intelligence Agent

O Market Intelligence Agent e o agente de IA responsavel por **monitorar tendencias de mercado**, analisar concorrentes e gerar **insights acionaveis** para a estrategia de marketing.

## Objetivo

Fornecer inteligencia de mercado atualizada para embasar decisoes de conteudo e campanhas, identificando oportunidades, riscos e tendencias relevantes para a organizacao.

## Outputs (Saidas)

O agente produz tres tipos de saidas, cada uma com proposito e cadencia distintos:

### 1. Market Findings (Descobertas de Mercado)

**Cadencia:** Diaria

Descobertas pontuais sobre movimentacoes do mercado, concorrentes e tendencias emergentes.

```json
{
  "type": "market_finding",
  "category": "trend",
  "title": "Crescimento de video curto no LinkedIn",
  "summary": "Videos de ate 90 segundos no LinkedIn tiveram aumento de 40% em engajamento...",
  "confidence": 0.85,
  "sources": ["fonte1.com", "fonte2.com"],
  "relevance": "high",
  "discovered_at": "2026-03-07T10:30:00Z"
}
```

### 2. Weekly Market Brief

**Cadencia:** Semanal

Relatorio consolidado com a visao completa da semana, incluindo:

| Secao                    | Descricao                                                        |
|--------------------------|------------------------------------------------------------------|
| **Top Trends**           | As principais tendencias identificadas na semana                 |
| **FAQs do Publico**      | Perguntas frequentes do publico-alvo nos canais monitorados      |
| **Ideias de Conteudo**   | Sugestoes de conteudo baseadas nas tendencias e FAQs             |
| **Oportunidades**        | Oportunidades de campanha identificadas                          |
| **Riscos**               | Riscos reputacionais ou de mercado que merecem atencao           |

```json
{
  "type": "weekly_brief",
  "period": "2026-03-01 a 2026-03-07",
  "top_trends": [...],
  "faqs": [...],
  "content_ideas": [...],
  "campaign_opportunities": [...],
  "risks": [...]
}
```

### 3. Content Brief

**Cadencia:** Sob demanda

Brief detalhado para producao de um conteudo especifico, baseado em insights do mercado.

| Campo              | Descricao                                          |
|--------------------|-----------------------------------------------------|
| **Topic**          | Tema principal do conteudo                          |
| **Angle**          | Angulo editorial sugerido                           |
| **Keywords**       | Palavras-chave relevantes para SEO e alcance        |
| **CTA**            | Call-to-action recomendado                          |
| **Target Audience**| Segmento do publico-alvo para o conteudo            |

```json
{
  "type": "content_brief",
  "topic": "IA Generativa no Marketing B2B",
  "angle": "Como PMEs estao usando IA para competir com grandes empresas",
  "keywords": ["ia generativa", "marketing b2b", "automacao", "pme"],
  "cta": "Agende uma demo gratuita",
  "target_audience": "Gestores de marketing em empresas de 50-200 funcionarios"
}
```

## Guardrails (Restricoes de Seguranca)

O Market Intelligence Agent opera sob restricoes rigorosas para garantir qualidade e conformidade:

| # | Guardrail                         | Descricao                                                                 |
|---|-----------------------------------|---------------------------------------------------------------------------|
| 1 | **Sem scraping**                  | O agente nao realiza web scraping direto — utiliza apenas APIs e fontes autorizadas |
| 2 | **Separacao fato vs inferencia**  | Toda saida distingue claramente entre fatos observados e inferencias do modelo |
| 3 | **Scores de confianca**           | Cada insight inclui um score de confianca (0.0 a 1.0) indicando a certeza da analise |
| 4 | **Atribuicao de fontes**          | Toda informacao factual inclui referencia as fontes originais             |
| 5 | **Sem dados sensiveis**           | O agente nao coleta ou armazena dados pessoais de individuos              |
| 6 | **Escopo organizacional**         | Analises sao limitadas ao setor e mercado relevante para a organizacao    |

### Scores de Confianca

| Faixa         | Significado                                                    |
|---------------|----------------------------------------------------------------|
| 0.9 - 1.0     | Alta confianca — baseado em dados concretos e multiplas fontes |
| 0.7 - 0.89    | Confianca moderada — fontes limitadas mas consistentes         |
| 0.5 - 0.69    | Baixa confianca — inferencia com poucas evidencias             |
| Abaixo de 0.5 | Especulativo — marcado claramente como hipotese                |

## Endpoint

```
POST /agents/market/analyze
```

**Role necessaria:** Autenticado (qualquer role)

### Request

```json
{
  "org_id": "uuid",
  "analysis_type": "weekly_brief",
  "parameters": {
    "sector": "tecnologia",
    "competitors": ["empresa_a", "empresa_b"],
    "focus_topics": ["ia generativa", "automacao de marketing"]
  }
}
```

### Response

```json
{
  "status": "success",
  "analysis_type": "weekly_brief",
  "data": {
    "period": "2026-03-01 a 2026-03-07",
    "top_trends": [...],
    "faqs": [...],
    "content_ideas": [...],
    "campaign_opportunities": [...],
    "risks": [...]
  },
  "metadata": {
    "sources_count": 12,
    "avg_confidence": 0.78,
    "generated_at": "2026-03-07T14:00:00Z"
  }
}
```
