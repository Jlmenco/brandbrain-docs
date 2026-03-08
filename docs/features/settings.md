---
sidebar_position: 9
---

# Configuracoes

A pagina de configuracoes (`/configuracoes`) centraliza as preferencias do usuario e da organizacao. Esta acessivel via menu lateral e tambem pelo Command Palette (`Cmd+K`).

## Perfil

A secao de perfil exibe os dados do usuario autenticado:

| Campo | Descricao |
|-------|-----------|
| **Nome** | Nome completo do usuario |
| **Email** | Email de login |
| **Organizacao** | Nome da organizacao ativa |
| **Role** | Papel do usuario na organizacao (`owner`, `admin`, `editor`, `viewer`) |

Os dados sao somente leitura nesta versao. A edicao de perfil sera disponibilizada em versao futura.

## Alterar Senha

O formulario de alteracao de senha permite que o usuario atualize sua credencial de acesso.

### Campos

| Campo | Validacao |
|-------|-----------|
| **Senha atual** | Obrigatorio |
| **Nova senha** | Minimo 8 caracteres |
| **Confirmar nova senha** | Deve coincidir com a nova senha |

### Validacao

A validacao e realizada no client-side antes do envio:

- Todos os campos sao obrigatorios
- A nova senha deve ter no minimo 8 caracteres
- Os campos "Nova senha" e "Confirmar nova senha" devem ser identicos
- Feedback visual via toast em caso de erro ou sucesso

:::note
A validacao no backend (endpoint de alteracao de senha) sera implementada em breve. Atualmente, a validacao ocorre apenas no frontend.
:::

## Preferencias de Tema

O usuario pode escolher entre tres modos de tema:

| Modo | Descricao |
|------|-----------|
| **Claro** | Interface com fundo claro e texto escuro |
| **Escuro** | Interface com fundo escuro e texto claro, ideal para ambientes com pouca luz |
| **Sistema** | Segue automaticamente a preferencia do sistema operacional |

A preferencia e persistida em `localStorage` (chave `bb_theme`) e aplicada imediatamente sem recarregar a pagina. O tema tambem pode ser alternado via o toggle `ThemeToggle` no header do dashboard.

## Preferencias de Idioma

O Brand Brain esta preparado para internacionalizacao (i18n) com suporte aos seguintes idiomas:

| Idioma | Codigo |
|--------|--------|
| **Portugues (Brasil)** | `pt-BR` |
| **Ingles (EUA)** | `en-US` |
| **Espanhol** | `es` |

:::info
O idioma padrao e `pt-BR`. A estrutura de i18n esta preparada para receber traducoes adicionais. Atualmente, toda a interface esta em portugues.
:::

A preferencia de idioma e salva no perfil do usuario e aplicada em toda a interface, incluindo labels, mensagens de erro e textos auxiliares.

## Integracoes / Webhooks

A secao de integracoes permite configurar webhooks para receber notificacoes de eventos do sistema em servicos externos.

### Configuracao de Webhook

| Campo | Descricao |
|-------|-----------|
| **URL** | Endpoint HTTPS que recebera os eventos via POST |
| **Eventos** | Seletor de eventos que disparam o webhook |

### Eventos disponiveis

| Evento | Descricao |
|--------|-----------|
| `content.created` | Novo conteudo criado |
| `content.approved` | Conteudo aprovado |
| `content.published` | Conteudo publicado |
| `content.rejected` | Conteudo rejeitado |
| `lead.created` | Novo lead capturado |
| `campaign.started` | Campanha iniciada |

Ao configurar um webhook, o sistema envia um payload JSON para a URL informada sempre que um dos eventos selecionados ocorrer. O payload inclui o tipo do evento, timestamp e os dados relevantes da entidade.

:::tip
Utilize webhooks para integrar o Brand Brain com ferramentas de CRM, automacao de marketing ou sistemas de notificacao internos.
:::

## Informacoes do Sistema

A secao de informacoes do sistema exibe dados tecnicos sobre a instancia do Brand Brain:

| Campo | Descricao |
|-------|-----------|
| **Versao** | Versao atual do Brand Brain (ex: `1.0.0-mvp`) |
| **Ambiente** | Ambiente de execucao (`development`, `staging`, `production`) |
| **Status da API** | Indicador de saude do backend (healthcheck) |

O status da API e verificado em tempo real ao carregar a pagina. Um indicador visual (verde/vermelho) mostra se o backend esta respondendo corretamente.
