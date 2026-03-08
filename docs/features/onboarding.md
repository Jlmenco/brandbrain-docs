---
sidebar_position: 10
---

# Onboarding

O Brand Brain inclui um wizard de onboarding para guiar novos usuarios na configuracao inicial do sistema. O wizard aparece automaticamente no dashboard na primeira visita do usuario.

## Visao Geral

O onboarding e um wizard de 3 passos que orienta o usuario desde o primeiro acesso ate a configuracao minima necessaria para comecar a usar o sistema. O objetivo e reduzir o tempo ate o primeiro valor (time-to-value) e garantir que o usuario entenda as principais funcionalidades.

## Passos do Wizard

### Passo 1: Boas-vindas

O primeiro passo apresenta uma tela de boas-vindas com:

- **Mensagem de boas-vindas** personalizada com o nome do usuario
- **Overview das features** principais do Brand Brain:
  - Gestao de conteudo com workflow de aprovacao
  - Gerenciamento de influenciadores e brand kits
  - Campanhas e acompanhamento de leads
  - Analytics e metricas em tempo real
  - Geracao de conteudo assistida por IA (RAG)
- **Botao "Comecar"** para avancar ao proximo passo

### Passo 2: Configuracao da Primeira Marca

O segundo passo guia o usuario na criacao do primeiro centro de custo (marca):

| Campo | Descricao | Obrigatorio |
|-------|-----------|:-----------:|
| **Nome** | Nome da marca ou centro de custo | Sim |
| **Codigo** | Codigo interno para identificacao (ex: `marca-01`) | Sim |
| **Orcamento** | Orcamento mensal disponivel para a marca (R$) | Nao |

Ao preencher e confirmar, o sistema cria o centro de custo vinculado a organizacao do usuario. Esse centro de custo sera usado para organizar conteudos, campanhas e metricas.

### Passo 3: Criacao do Primeiro Influenciador

O terceiro e ultimo passo orienta a criacao do primeiro influenciador:

| Campo | Descricao | Obrigatorio |
|-------|-----------|:-----------:|
| **Nome** | Nome do influenciador ou persona | Sim |
| **Tipo** | `human` (pessoa real) ou `virtual` (persona IA) | Sim |
| **Nicho** | Area de atuacao (ex: tecnologia, saude, lifestyle) | Sim |
| **Tom** | Tom de voz para geracao de conteudo (ex: informal, profissional) | Sim |
| **Idioma** | Idioma principal do conteudo | Sim |

Ao concluir este passo, o usuario ja possui a estrutura minima para comecar a criar e gerenciar conteudo no Brand Brain.

## Persistencia

O estado de conclusao do onboarding e persistido em `localStorage`:

| Chave | Valor | Descricao |
|-------|-------|-----------|
| `bb_onboarding_done` | `"true"` | Flag indicando que o onboarding foi concluido |

### Comportamento

- **Primeiro acesso**: O wizard e exibido automaticamente ao carregar o dashboard
- **Acessos subsequentes**: Se o flag `bb_onboarding_done` estiver presente no `localStorage`, o wizard nao e exibido
- **Limpar dados do navegador**: Se o `localStorage` for limpo, o wizard aparecera novamente no proximo acesso

:::tip
Para re-exibir o wizard de onboarding, remova a chave `bb_onboarding_done` do `localStorage` do navegador (DevTools > Application > Local Storage).
:::

## Exibicao no Dashboard

O wizard e renderizado como um overlay modal sobre o dashboard, impedindo interacao com o restante da interface ate que os 3 passos sejam concluidos (ou o wizard seja fechado).

O usuario pode navegar entre os passos usando os botoes "Voltar" e "Proximo" / "Concluir". Uma barra de progresso indica o passo atual (1/3, 2/3, 3/3).

Ao concluir o ultimo passo, o wizard fecha automaticamente e o dashboard e exibido com os dados recem-criados (centro de custo e influenciador) ja disponiveis nas listagens e seletores.
