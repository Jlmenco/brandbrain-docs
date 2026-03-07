---
sidebar_position: 1
---

# Gestao de Conteudo

O Brand Brain oferece um sistema completo de criacao, revisao e publicacao de conteudo para multiplas plataformas.

## Criando um Conteudo

Cada item de conteudo possui os seguintes campos:

| Campo | Descricao |
|-------|-----------|
| **Titulo** | Titulo interno para identificacao |
| **Body** | Texto do conteudo a ser publicado |
| **Plataforma** | `instagram`, `linkedin`, `tiktok`, `twitter` ou `youtube` |
| **Influenciador** | Influenciador vinculado (determina tom e estilo) |
| **Centro de Custo** | Centro de custo responsavel pelo conteudo |

No frontend, a criacao e feita via dialog (`CreateContentDialog`) com selecao de influenciador, plataforma e area de texto para o corpo do conteudo.

## Workflow de Status

O conteudo segue uma maquina de estados linear:

```
draft → review → approved → scheduled → posted
```

| Transicao | Acao | Permissao |
|-----------|------|-----------|
| `draft` → `review` | Submeter para revisao | Editor+ |
| `review` → `approved` | Aprovar conteudo | Admin+ |
| `review` → `draft` | Solicitar alteracoes | Admin+ |
| `review` → `rejected` | Rejeitar | Admin+ |
| `approved` → `scheduled` | Agendar publicacao | Admin+ |
| `scheduled` → `posted` | Publicar (automatico via Worker) | Sistema |

## Editor de Conteudo

A pagina de detalhe (`/conteudos/[id]`) exibe o conteudo com acoes contextuais baseadas no status atual e na role do usuario. O componente `ContentWorkflowActions` renderiza apenas os botoes permitidos.

## Agendamento

O `ScheduleDialog` permite selecionar data e hora para publicacao. Ao confirmar, o conteudo muda para status `scheduled` e o Worker assume a publicacao no horario programado, com suporte a retry e backoff exponencial.

## Listagem

A listagem de conteudos (`/conteudos`) inclui:

- **Paginacao** server-side (`skip`/`limit`)
- **Busca** com debounce de 300ms
- **Ordenacao** por data de criacao
- **Coluna influenciador** com nome vinculado
