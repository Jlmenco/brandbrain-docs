---
sidebar_position: 3
---

# Workflows

O Brand Brain organiza o ciclo de vida do conteudo atraves de workflows bem definidos. Desde a criacao de um influenciador ate a publicacao e rastreamento de resultados, cada etapa segue um fluxo controlado com maquina de estados, audit logs e mecanismos de retry.

## Maquina de Status do Conteudo

Cada conteudo (ContentItem) segue uma maquina de status com as seguintes transicoes:

```
draft ──────────► review
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
      approved   changes    rejected
          │      requested
          │         │
          │         ▼
          │       draft (volta para edicao)
          ▼
      scheduled
          │
          ▼
       posted
```

| Status | Descricao |
|--------|-----------|
| **draft** | Rascunho inicial. Pode ser editado livremente. |
| **review** | Submetido para revisao. Aguardando aprovacao de um admin/owner. |
| **approved** | Aprovado. Pronto para ser agendado. |
| **changes_requested** | Revisao solicitou alteracoes. Volta para edicao como draft. |
| **rejected** | Rejeitado definitivamente. |
| **scheduled** | Agendado para publicacao em data/hora especifica. |
| **posted** | Publicado com sucesso na plataforma de destino. |

### Permissoes por Transicao

| Transicao | Roles Permitidas |
|-----------|-----------------|
| draft -> review | owner, admin, editor |
| review -> approved | owner, admin |
| review -> changes_requested | owner, admin |
| review -> rejected | owner, admin |
| approved -> scheduled | owner, admin |
| scheduled -> posted | automatico (worker) |

## Os 5 Workflows Principais

### 1. Criar Influenciador e Brand Kit

Workflow de cadastro da persona de marca:

1. **Criar influenciador** com dados basicos (nome, tipo, nicho, tom de voz, emoji, idioma, estilo de CTA)
2. **Configurar brand kit** com diretrizes de marca (descricao, propostas de valor, produtos, publico-alvo, guias de estilo, links)
3. **Embeddings automaticos**: ao salvar o brand kit, o sistema gera automaticamente embeddings (text-embedding-3-small, 1536 dimensoes) para uso no RAG

### 2. Gerar Macro Conteudo e Redistribuir

Workflow de geracao de conteudo com IA:

1. **Criar macro conteudo** com topico e corpo base
2. **Redistribuir** via endpoint `/redistribute`: o sistema gera drafts adaptados para cada plataforma (LinkedIn, Instagram, etc.)
3. O **Marketing Agent** utiliza RAG com embeddings do brand kit para contextualizar o conteudo
4. Cada draft gerado e criado como um ContentItem com status `draft`

### 3. Aprovacao, Agendamento e Publicacao

Workflow principal de publicacao:

1. Editor **cria ou edita** o conteudo (status: `draft`)
2. Editor **submete para revisao** (status: `review`)
3. Admin/owner **aprova** (status: `approved`) ou **solicita alteracoes** / **rejeita**
4. Admin/owner **agenda publicacao** com data e hora (status: `scheduled`)
5. **Worker publica automaticamente** no horario agendado (status: `posted`)

### 4. Rastreamento e Leads

Workflow de acompanhamento de resultados:

1. Sistema gera **tracking links** (short links com parametros UTM) para cada conteudo publicado
2. Cliques nos links geram **eventos** (Event) com dados de IP, user agent, etc.
3. Visitantes que preenchem formularios sao registrados como **leads**
4. **MetricsDaily** agrega metricas diarias (impressoes, likes, comentarios, compartilhamentos, cliques)

### 5. Operacoes de Agentes

Workflow de agentes autonomos:

1. **Marketing Agent**: gera drafts de conteudo utilizando RAG com contexto do brand kit
2. **Market Agent**: analisa tendencias e sugere topicos de conteudo
3. Ambos operam em modo mock (configuraveis via `AI_DEFAULT_PROVIDER` para usar OpenAI real)

## Worker de Publicacao

O worker e responsavel por publicar conteudos agendados de forma automatica e confiavel.

### Mecanismo de Poll + Pub/Sub

O worker utiliza dois mecanismos complementares para detectar conteudos prontos:

1. **Polling**: a cada 30 segundos, consulta o banco por itens com status `scheduled` e `scheduled_at <= now()`
2. **Redis Pub/Sub**: escuta o canal `bb:publish_signal` para acordar imediatamente quando um novo agendamento e criado

```python
# Polling loop
while running:
    item = get_next_scheduled_item(db)
    if item:
        process_item(item)
    await asyncio.sleep(30)

# Redis subscriber (paralelo)
async for message in pubsub.listen("bb:publish_signal"):
    wake_up_polling_loop()
```

### Concorrencia Segura

Para suportar multiplas instancias do worker sem conflitos:

```sql
SELECT * FROM content_items
WHERE status = 'scheduled' AND scheduled_at <= NOW()
ORDER BY scheduled_at ASC
LIMIT 1
FOR UPDATE SKIP LOCKED
```

O `FOR UPDATE SKIP LOCKED` garante que cada item seja processado por apenas uma instancia.

### Retry com Backoff Exponencial

Em caso de falha na publicacao, o worker aplica retry com backoff exponencial:

| Tentativa | Intervalo de Espera |
|-----------|-------------------|
| 1a falha | 30 segundos |
| 2a falha | 120 segundos (2 min) |
| 3a falha | 480 segundos (8 min) |

- **Maximo de 3 tentativas** por conteudo
- Apos 3 falhas, o item e marcado como `failed` permanentemente
- Cada tentativa (sucesso ou falha) e registrada no audit log

### Mock Publisher

Atualmente, o sistema utiliza um mock publisher com dispatch por provider:

```python
PUBLISHER_MAP = {
    "linkedin": mock_linkedin_publish,
    "instagram": mock_instagram_publish,
    "twitter": mock_twitter_publish,
    "facebook": mock_facebook_publish,
}
```

A integracao com APIs reais (LinkedIn API, Instagram API, etc.) esta planejada para versoes futuras.

## Audit Log

Toda mudanca de estado no sistema e registrada no **Audit Log**:

- **Quem**: `user_id` do usuario que executou a acao
- **O que**: `action` (create, update, approve, reject, schedule, publish, etc.)
- **Onde**: `entity_type` + `entity_id` (ex: content_item #42)
- **Detalhes**: campo JSON com informacoes adicionais (status anterior, novo status, motivo, etc.)

O audit log e acessivel via pagina `/historico` no dashboard, com filtros por tipo de entidade, acao e periodo.
