---
sidebar_position: 7
---

# Notificacoes

O Brand Brain possui um sistema de notificacoes que mantém a equipe informada sobre eventos importantes via canais in-app e email.

## Modelo de Notificacao

| Campo | Tipo | Descricao |
|-------|------|-----------|
| **title** | `string` | Titulo curto da notificacao |
| **body** | `string` | Corpo descritivo do evento |
| **channel** | `enum` | Canal de entrega (`in_app`, `email`, `both`) |
| **read** | `bool` | Status de leitura |
| **user_id** | `UUID` | Destinatario |
| **created_at** | `datetime` | Data/hora de criacao |

## Notificacoes In-App

### NotificationBell

O componente `NotificationBell` fica no header da aplicacao e exibe:

- Icone de sino com badge numerico (contagem de nao lidas)
- Ao clicar, abre um `Popover` com a lista de notificacoes recentes
- Cada item mostra titulo, corpo resumido e horario
- Opcao de marcar como lida individualmente ou todas de uma vez

### Endpoints

```
GET    /api/v1/notifications              # Listar notificacoes do usuario
PUT    /api/v1/notifications/{id}/read    # Marcar como lida
PUT    /api/v1/notifications/read-all     # Marcar todas como lidas
```

## Notificacoes por Email

Para notificacoes com canal `email` ou `both`, o sistema envia via SMTP. A configuracao requer as variaveis de ambiente:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@brandbrain.dev
SMTP_PASSWORD=secret
SMTP_FROM=Brand Brain <noreply@brandbrain.dev>
```

## Eventos que Geram Notificacoes

O sistema gera notificacoes automaticamente nos seguintes eventos:

| Evento | Destinatario | Canal |
|--------|-------------|-------|
| Conteudo submetido para revisao | Admins da org | in_app |
| Conteudo aprovado | Autor do conteudo | in_app + email |
| Conteudo rejeitado | Autor do conteudo | in_app + email |
| Conteudo publicado | Autor + admins | in_app |
| Novo lead capturado | Editors da org | in_app |
| Campanha iniciada | Membros da org | in_app |
| Falha na publicacao | Admins da org | email |

## Servico de Notificacoes

O `NotificationService` centraliza a criacao e envio:

1. Recebe o evento e contexto
2. Determina destinatarios conforme regras
3. Cria registro no banco (canal `in_app`)
4. Dispara email se o canal incluir `email`
5. O frontend atualiza via polling periodico
