---
sidebar_position: 2
---

# Checklist de Producao

Este guia lista os itens necessarios para levar o Brand Brain do ambiente de desenvolvimento para producao. Como o projeto esta em fase de MVP, a maioria dos itens esta pendente.

:::caution
Este documento e um checklist de planejamento. Os itens marcados como TODO ainda nao foram implementados.
:::

## Variaveis de Ambiente

Alterar obrigatoriamente antes do deploy:

| Variavel | Valor Dev | Acao |
|----------|-----------|------|
| `SECRET_KEY` | `super-secret-key-change-me` | **TODO**: Gerar chave aleatoria forte (256 bits) |
| `DATABASE_URL` | `postgresql://brandbrain:brandbrain@postgres/brandbrain` | **TODO**: Usar credenciais seguras |
| `REDIS_URL` | `redis://redis:6379` | **TODO**: Configurar senha se exposto |
| `AI_DEFAULT_PROVIDER` | `mock` | **TODO**: Alterar para `openai` com chave real |
| `OPENAI_API_KEY` | — | **TODO**: Configurar chave de producao |
| `SMTP_*` | — | **TODO**: Configurar servidor SMTP real |
| `CORS_ORIGINS` | `*` | **TODO**: Restringir ao dominio de producao |

## Gestao de Segredos

- [ ] **TODO**: Utilizar um gerenciador de segredos (AWS Secrets Manager, HashiCorp Vault, ou similar)
- [ ] **TODO**: Nunca commitar `.env` no repositorio
- [ ] **TODO**: Rotacionar chaves periodicamente
- [ ] **TODO**: Configurar JWT com chave RS256 em vez de HS256 para producao

## Banco de Dados

- [ ] **TODO**: Configurar backups automaticos (pg_dump diario ou WAL archiving)
- [ ] **TODO**: Testar procedimento de restore
- [ ] **TODO**: Habilitar SSL nas conexoes do PostgreSQL
- [ ] **TODO**: Configurar connection pooling (PgBouncer)
- [ ] **TODO**: Monitorar tamanho das tabelas de embeddings

## SSL/TLS

- [ ] **TODO**: Obter certificado SSL (Let's Encrypt ou certificado comercial)
- [ ] **TODO**: Configurar HTTPS no nginx
- [ ] **TODO**: Redirecionar HTTP para HTTPS
- [ ] **TODO**: Configurar HSTS headers

## Monitoramento

A stack de observabilidade ja esta parcialmente configurada:

| Servico | Status | Proximo Passo |
|---------|--------|---------------|
| Prometheus | Rodando | **TODO**: Configurar alertas |
| Loki | Rodando | **TODO**: Configurar retencao de logs |
| Grafana | Rodando | **TODO**: Criar dashboards customizados |

Itens adicionais:
- [ ] **TODO**: Configurar alertas para erros 5xx
- [ ] **TODO**: Monitorar latencia dos endpoints
- [ ] **TODO**: Alertas de uso de disco e memoria
- [ ] **TODO**: Uptime monitoring externo

## Agregacao de Logs

- [ ] **TODO**: Definir politica de retencao (ex: 30 dias)
- [ ] **TODO**: Configurar log rotation nos containers
- [ ] **TODO**: Estruturar logs em JSON para melhor indexacao
- [ ] **TODO**: Filtrar dados sensiveis dos logs

## Escalabilidade

| Componente | Estrategia |
|-----------|-----------|
| **API** | **TODO**: Multiplas replicas atras do nginx (load balancer) |
| **Worker** | **TODO**: Multiplos workers (ja suporta `SELECT FOR UPDATE SKIP LOCKED`) |
| **PostgreSQL** | **TODO**: Read replicas para consultas de analytics |
| **Redis** | **TODO**: Redis Sentinel ou Cluster para alta disponibilidade |
| **Frontend** | **TODO**: CDN para assets estaticos |

## Seguranca Adicional

- [ ] **TODO**: Rate limiting nos endpoints de autenticacao
- [ ] **TODO**: Helmet headers no nginx (X-Frame-Options, CSP, etc.)
- [ ] **TODO**: Sanitizacao de inputs (ja parcial via Pydantic)
- [ ] **TODO**: Audit log de acessos administrativos (parcialmente implementado)
- [ ] **TODO**: Politica de senhas mais restritiva
- [ ] **TODO**: 2FA para contas admin

## CI/CD

- [ ] **TODO**: Pipeline de testes automaticos (GitHub Actions)
- [ ] **TODO**: Build e push de imagens Docker para registry
- [ ] **TODO**: Deploy automatico para staging
- [ ] **TODO**: Deploy manual (aprovado) para producao
- [ ] **TODO**: Rollback automatico em caso de falha no health check
