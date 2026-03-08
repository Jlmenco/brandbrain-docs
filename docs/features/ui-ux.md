---
sidebar_position: 8
---

# UX e Interface

O Brand Brain prioriza uma experiencia de usuario consistente e responsiva em todo o dashboard. Esta pagina documenta os padroes de UX e componentes de interface implementados.

## Empty States

Todas as paginas de listagem utilizam o componente reutilizavel `EmptyState` quando nao ha dados para exibir. O componente recebe:

| Prop | Tipo | Descricao |
|------|------|-----------|
| **icon** | `ReactNode` | Icone contextual (ex: FileText, Users, Target) |
| **title** | `string` | Titulo descritivo ("Nenhum conteudo encontrado") |
| **description** | `string` | Texto auxiliar com orientacao ao usuario |
| **action** | `ReactNode` | Botao opcional para criar o primeiro item |

O `EmptyState` e exibido automaticamente quando a lista retorna vazia, seja por ausencia de dados ou por filtro de busca sem resultados. Isso elimina paginas em branco e orienta o usuario sobre o proximo passo.

## Responsividade

O dashboard se adapta a diferentes tamanhos de tela:

### Tabelas

Em telas pequenas (mobile), todas as tabelas de listagem possuem scroll horizontal (`overflow-x-auto`), permitindo que o usuario deslize para visualizar todas as colunas sem quebrar o layout.

### Sidebar

| Viewport | Comportamento |
|----------|---------------|
| **Desktop** (`>= lg`) | Sidebar fixa com largura de `w-56`, sempre visivel |
| **Mobile** (`< lg`) | Sidebar oculta, acessivel via icone de menu (hamburger) no header |

No mobile, a sidebar abre como um drawer lateral (componente `Sheet` baseado em Radix Dialog) pela esquerda da tela. O container principal utiliza `min-w-0` para evitar overflow horizontal.

O componente `SidebarContent` e extraido e reutilizado tanto na versao fixa (desktop) quanto no drawer (mobile), garantindo consistencia visual.

## Dark Mode

O Brand Brain suporta tres modos de tema:

| Modo | Descricao |
|------|-----------|
| **Claro** | Tema padrao com fundo claro |
| **Escuro** | Tema escuro, reduz fadiga visual |
| **Sistema** | Segue a preferencia do sistema operacional (`prefers-color-scheme`) |

### Implementacao

- **Toggle**: Componente `ThemeToggle` no header com icones Sun/Moon
- **Persistencia**: Preferencia salva em `localStorage` (chave `bb_theme`)
- **Anti-FOUC**: Script inline no `<head>` aplica a classe `.dark` antes do render, evitando flash de tema incorreto
- **Hydration**: `suppressHydrationWarning` no elemento raiz para evitar mismatch entre server e client
- **CSS**: Variaveis CSS definidas em `.dark` no `globals.css`, com `darkMode: ["class"]` no Tailwind

## Busca Global (Cmd+K)

O Command Palette permite navegacao rapida por todo o dashboard sem uso do mouse.

### Como usar

1. Pressione `Cmd+K` (macOS) ou `Ctrl+K` (Windows/Linux) em qualquer pagina
2. Digite para filtrar entre paginas, acoes e itens recentes
3. Use setas para navegar e `Enter` para selecionar
4. Pressione `Esc` para fechar

### Funcionalidades

- **Filtragem em tempo real**: Os resultados atualizam conforme o usuario digita
- **Navegacao por paginas**: Acesso direto a qualquer secao do dashboard (Conteudos, Influenciadores, Campanhas, Leads, etc.)
- **Acoes rapidas**: Criar conteudo, criar influenciador, abrir configuracoes
- **Atalho de teclado**: Sempre acessivel via `Cmd+K` / `Ctrl+K`

## Confirmacao de Acoes

Acoes destrutivas ou irreversiveis exigem confirmacao explicita do usuario atraves do componente `ConfirmDialog`.

### Acoes que exigem confirmacao

| Acao | Contexto |
|------|----------|
| **Rejeitar conteudo** | Workflow de revisao |
| **Publicar agora** | Publicacao imediata de conteudo |
| **Excluir item** | Remocao de qualquer entidade |

O dialog apresenta titulo, descricao da consequencia e dois botoes: "Cancelar" (fecha o dialog) e "Confirmar" (executa a acao). Botoes destrutivos utilizam a variante `destructive` para destaque visual.

## Export CSV/PDF

Todas as paginas de listagem oferecem botoes para exportacao de dados:

| Formato | Descricao |
|---------|-----------|
| **CSV** | Arquivo separado por virgulas, compativel com Excel e Google Sheets |
| **PDF** | Documento formatado para impressao e compartilhamento |

### Listagens com export

- **Conteudos**: Titulo, status, plataforma, influenciador, data de criacao
- **Campanhas**: Nome, status, datas, orcamento
- **Leads**: Nome, email, status, fonte, data de criacao

A exportacao respeita os filtros ativos na listagem. Se o usuario filtrou por status ou buscou um termo, o arquivo exportado contera apenas os resultados filtrados.

## Loading Skeletons

Enquanto dados estao sendo carregados da API, o dashboard exibe placeholders animados (skeletons) no lugar do conteudo final. Isso evita layout shift e fornece feedback visual imediato.

### Implementacao

O componente `Skeleton` (`components/ui/skeleton.tsx`) utiliza a animacao `animate-pulse` do Tailwind e e aplicado em todas as paginas do dashboard:

- Pagina de login (auth layout)
- Dashboard principal
- Listagens (conteudos, influenciadores, campanhas, leads)
- Paginas de detalhe
- Historico de auditoria

Cada pagina possui seu proprio skeleton customizado, respeitando o layout esperado da pagina carregada.

## Toast Notifications

O Brand Brain utiliza a biblioteca [sonner](https://sonner.emilkowal.dev/) para exibir notificacoes toast com feedback visual de todas as acoes do usuario.

### Configuracao

O componente `<Toaster richColors position="top-right" />` e montado no root layout, disponibilizando toasts em todas as paginas.

### Tipos de toast

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `toast.success()` | Acao concluida com sucesso | "Conteudo criado com sucesso" |
| `toast.error()` | Erro na operacao | "Erro ao salvar influenciador" |
| `toast.info()` | Informacao neutra | "Exportacao iniciada" |

### Cobertura

Toasts estao implementados em todos os 7 dialogs de CRUD do sistema, alem das acoes do workflow de conteudo (`ContentWorkflowActions`). Toda acao que altera dados fornece feedback via toast, seja de sucesso ou de erro.
