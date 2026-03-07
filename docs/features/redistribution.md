---
sidebar_position: 2
---

# Redistribuicao Cross-Brand

A redistribuicao permite transformar um conteudo macro em multiplas versoes adaptadas para diferentes marcas, influenciadores e plataformas.

## Conceito de MacroContent

O `MacroContent` e um conteudo-fonte que serve como base para gerar variacoes. Em vez de criar conteudo do zero para cada marca, voce escreve uma vez e o sistema adapta automaticamente.

**Exemplo:** Um post sobre lancamento de produto pode gerar:
- Post formal para LinkedIn do perfil corporativo
- Reels descontraido para Instagram do influenciador
- Thread tecnica para Twitter do especialista

## Regras de Adaptacao

O motor de redistribuicao aplica 6 regras ao transformar o conteudo:

| Regra | Descricao |
|-------|-----------|
| **Tom de voz** | Ajusta formalidade e estilo conforme o influenciador (ex: profissional, casual, tecnico) |
| **Formato da plataforma** | Respeita limites de caracteres, estrutura e convencoes de cada rede social |
| **Hashtags** | Gera hashtags relevantes para o nicho e plataforma-alvo |
| **CTA (Call-to-Action)** | Adapta a chamada para acao conforme o estilo do influenciador |
| **Audiencia** | Ajusta linguagem e referencias para o publico-alvo do influenciador |
| **Voz da marca** | Incorpora elementos do Brand Kit (proposta de valor, produtos, diretrizes de estilo) |

## Template de Prompt

O sistema utiliza um prompt template estruturado que alimenta o agente de IA:

```
Voce e um especialista em marketing digital.
Adapte o conteudo abaixo para o influenciador {nome},
plataforma {plataforma}, tom {tom}.

Conteudo original:
{macro_content.body}

Brand Kit context:
{rag_chunks}

Regras:
1. Mantenha a mensagem central
2. Adapte o tom para {tom}
3. Respeite o limite de {char_limit} caracteres
4. Inclua hashtags relevantes para {nicho}
5. Use CTA no estilo: {cta_style}
6. Fale para a audiencia: {audience}
```

## Endpoint

```
POST /api/v1/content/redistribute
```

Recebe o `macro_content_id` e a lista de influenciadores-alvo. Retorna os drafts gerados, um por combinacao influenciador + plataforma.

## Fluxo Completo

1. Criar o MacroContent com o conteudo base
2. Chamar o endpoint de redistribuicao com os influenciadores-alvo
3. O sistema gera drafts adaptados usando o Marketing Agent
4. Cada draft entra no workflow padrao (`draft` → `review` → ...)
5. Revisores podem editar antes de aprovar
