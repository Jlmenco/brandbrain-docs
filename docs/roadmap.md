---
sidebar_position: 99
---

# Roadmap

O desenvolvimento do Brand Brain esta organizado em fases progressivas, desde o MVP funcional ate a autonomia completa do sistema.

---

## Fase 1 — MVP (Concluida)

Fundacao completa do sistema com todas as funcionalidades essenciais.

- [x] **Autenticacao**: Login JWT (HS256) com python-jose + passlib/bcrypt
- [x] **RBAC**: Sistema de roles (owner, admin, editor, viewer) com enforcement backend e frontend
- [x] **Organizacoes**: Multi-org com membros e roles por organizacao
- [x] **Centros de Custo**: Agrupamento financeiro de conteudos e leads
- [x] **Influenciadores**: CRUD completo com tipos master/brand
- [x] **Brand Kit**: Modelo de identidade de marca com campos estruturados
- [x] **Conteudo**: Workflow completo (draft → review → approved → scheduled → posted)
- [x] **Redistribuicao**: MacroContent com adaptacao por influenciador/plataforma
- [x] **Agentes de IA**: Marketing Agent + Market Agent (modo mock)
- [x] **Rastreamento**: Short links com UTM + registro de eventos
- [x] **Leads**: CRUD com pipeline de vendas (novo → qualificado → proposta → ganho/perdido)
- [x] **Analytics**: MetricsDaily + dashboard com graficos Recharts
- [x] **Publicacao**: Worker com poll + Redis pub/sub, retry com backoff exponencial
- [x] **Notificacoes**: In-app (NotificationBell) + email (SMTP)
- [x] **Campanhas**: CRUD com status e vinculacao de conteudos
- [x] **Audit Log**: Historico completo de acoes com UI de consulta
- [x] **Frontend**: Next.js 14 + Tailwind + shadcn/ui com dark mode
- [x] **Testes**: 127 testes API + 22 testes Worker + 13 testes E2E (Playwright)
- [x] **Migrations**: Alembic com schema versionado (23 tabelas)
- [x] **UX Polish**: Toast, loading skeletons, sidebar responsiva, dark mode
- [x] **Repo Split**: Separacao em 4 repos independentes (api, web, mobile, docs)
- [x] **CI/CD**: GitHub Actions em todos os repos
- [x] **Documentacao**: Site Docusaurus com 25+ paginas no GitHub Pages

---

## Fase 1.5 — Transicao (Em Andamento)

Ponte entre o MVP e a versao com IA real.

- [x] **RAG + Embeddings**: pgvector, BrandKitEmbedding, auto-embed, prompt builder
- [x] **Empty States**: Componente reutilizavel em todas as listagens
- [x] **Edit Content Dialog**: Edicao inline de conteudos
- [x] **Responsividade**: Tabelas com scroll horizontal em mobile
- [x] **Confirmacao de Acoes**: ConfirmDialog para acoes destrutivas
- [x] **Pagina de Configuracoes**: Perfil, senha, tema, idioma, webhooks, info sistema
- [x] **Filtros Avancados**: Filtro por influenciador e date range no conteudos
- [x] **Export CSV/PDF**: Exportacao de dados em listagens
- [x] **Command Palette (Cmd+K)**: Busca global com navegacao por teclado
- [x] **Onboarding Wizard**: 3 passos para novos usuarios
- [x] **Webhook Settings**: Configuracao de webhooks (Slack/Discord/Teams)
- [x] **i18n**: Sistema de internacionalizacao (pt-BR, en-US, es)
- [x] **Testes E2E**: 32 novos testes (total: 45 E2E)
- [x] **Deploy Staging**: compose.staging.yml + script + GitHub Actions
- [x] **Integracao LLM real**: AIGateway com suporte a OpenAI (GPT-4o-mini) e Anthropic (Claude Haiku)
- [x] **AWS Infrastructure**: Terraform (ECS Fargate + NLB porta 8443 + CloudFront+S3 + Lambda Scheduler + Secrets Manager)
- [ ] **Providers reais**: Integracao com APIs do LinkedIn, Instagram, TikTok, Twitter, YouTube

---

## Fase 2 — Evolucao

Funcionalidades avancadas para escalar a operacao.

- [ ] **Multi-influenciador**: Geracao simultanea de conteudo para N influenciadores com um clique
- [ ] **Motor de Recomendacao**: Sugestoes automaticas de horarios, hashtags e formatos baseadas em historico de performance
- [ ] **Templates de Conteudo**: Biblioteca de templates reutilizaveis por nicho e plataforma
- [ ] **A/B Testing**: Gerar variacoes de conteudo e medir qual performa melhor
- [ ] **Integracao CRM**: Conexao com ferramentas externas (HubSpot, Pipedrive) para sincronizar leads
- [ ] **Webhook de Eventos**: Backend de webhooks para notificacoes externas em tempo real

---

## Fase 3 — Autonomia

O objetivo final: um sistema de inteligencia de marca verdadeiramente autonomo.

- [ ] **Colaboracao Cross-Brand**: Marcas do mesmo grupo sugerindo e co-criando conteudo automaticamente
- [ ] **Digital Human**: Avatar de IA representando o influenciador para interacoes automatizadas
- [ ] **Autopost Inteligente**: Publicacao autonoma com aprovacao automatica baseada em score de confianca
- [ ] **Analise de Sentimento**: Monitoramento de mencoes e comentarios com classificacao automatica
- [ ] **Otimizacao Continua**: IA ajustando estrategia de conteudo em tempo real baseada em metricas
- [ ] **Voice/Video Generation**: Geracao automatica de conteudo em audio e video com voz sintetica
