---
sidebar_position: 1
slug: /intro
---

# O que e o Brand Brain?

**Brand Brain** e um sistema de inteligencia de marca autonomo (ABIS — Autonomous Brand Intelligence System) para gerenciar multiplas marcas dentro de um grupo empresarial com o poder da inteligencia artificial.

## Problema

Grupos empresariais com multiplas marcas enfrentam:
- Fragmentacao de ferramentas (5-8 plataformas separadas para conteudo, influenciadores, campanhas, leads)
- Falta de consistencia na voz e identidade de cada marca
- Impossibilidade de redistribuir conteudo entre marcas de forma inteligente
- Ausencia de inteligencia competitiva unificada

## Solucao

Uma plataforma unica que centraliza:
- **Gestao de conteudo com IA** — geracao, revisao, aprovacao e publicacao automatizada
- **Influenciadores + Brand Kit** — cada marca tem sua identidade, voz e diretrizes
- **Redistribuicao cross-brand** — conteudo macro adaptado por marca/influenciador
- **Campanhas e Leads** — pipeline completo de marketing e vendas
- **Agentes autonomos** — Marketing Agent e Market Intelligence Agent
- **Analytics e Tracking** — metricas, UTM, short links, attribution

## Stack Tecnologica

| Camada | Tecnologia |
|--------|-----------|
| Backend | FastAPI + SQLModel + PostgreSQL 16 (pgvector) + Redis |
| Frontend | Next.js 14 + Tailwind CSS v3 + shadcn/ui + Recharts |
| Worker | Scheduler + Publisher com retry e backoff |
| Auth | JWT (HS256) com RBAC (owner/admin/editor/viewer) |
| IA | AI Gateway (mock/openai) + RAG com embeddings |
| Infra | Docker Compose (9 servicos) + Nginx + Prometheus + Grafana + Loki |

## Objetivos do MVP

1. Cadastro e gestao de influenciadores com Brand Kit completo
2. Geracao, revisao e publicacao de conteudo com workflow de aprovacao
3. Redistribuicao de conteudo master para multiplas marcas
4. Agentes IA para geracao e inteligencia de mercado
5. Tracking com short links, UTM e captura de leads
6. Dashboard com metricas, graficos e atividade recente
7. RBAC com 4 roles e enforcement completo (frontend + backend)
