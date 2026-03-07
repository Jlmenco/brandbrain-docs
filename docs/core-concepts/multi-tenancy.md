---
sidebar_position: 1
---

# Multi-Tenancy

O Brand Brain utiliza uma arquitetura **multi-tenant** que garante isolamento completo de dados entre diferentes organizacoes. Cada entidade no sistema pertence a uma organizacao, e todas as consultas filtram por `org_id` para impedir vazamento de dados entre tenants.

## Hierarquia de Entidades

```
Organization
  └── Cost Centers (marcas, unidades de negocio)
        └── Content Items
  └── Influencers
        └── Brand Kits
              └── Brand Kit Embeddings
  └── Campaigns
  └── Leads
```

## Conceitos Principais

### Organization

A **Organization** e a entidade de nivel mais alto. Representa um grupo empresarial ou empresa que utiliza o Brand Brain. Todos os dados no sistema estao vinculados a uma organizacao.

- Cada organizacao possui um `name` e um `slug` unico
- Serve como fronteira de isolamento de dados (tenant boundary)
- Todos os usuarios precisam ser membros de pelo menos uma organizacao

### Cost Centers

Os **Cost Centers** sao subdivisoes dentro de uma organizacao. Representam marcas, unidades de negocio (BUs) ou departamentos.

- Pertencem a uma organizacao (`org_id`)
- Conteudos sao criados dentro de um cost center
- Permitem controle granular de orcamento e alocacao de recursos
- Exemplo: uma holding com 3 marcas teria 3 cost centers

### OrgMember

O **OrgMember** e a tabela de vinculo entre usuarios e organizacoes. Define qual papel (role) cada usuario exerce dentro de uma organizacao.

- Vincula `user_id` a `org_id`
- Atribui uma role: `owner`, `admin`, `editor` ou `viewer`
- Um usuario pode pertencer a multiplas organizacoes com roles diferentes
- A role determina as permissoes do usuario (veja [RBAC](./rbac.md))

### Influencers

Os **Influencers** representam as personas ou perfis de marca que produzem conteudo. Pertencem diretamente a uma organizacao.

- Vinculados a uma organizacao via `org_id`
- Possuem caracteristicas como tipo, nicho, tom de voz, idioma e estilo de CTA
- Cada influenciador pode ter um **Brand Kit** associado

### Brand Kits

O **Brand Kit** contem as diretrizes de marca de um influenciador: propostas de valor, produtos, publico-alvo, guias de estilo e links relevantes.

- Vinculado a um influenciador (`influencer_id`)
- Utilizado pelo sistema de RAG para gerar conteudo contextualizado
- Ao ser atualizado, gera embeddings automaticamente para busca semantica

### Content Items

Os **Content Items** sao os conteudos produzidos dentro do sistema. Pertencem a um cost center (e, portanto, indiretamente a uma organizacao).

- Vinculados a um cost center (`cost_center_id`)
- Associados a um influenciador (`influencer_id`) e opcionalmente a uma campanha
- Seguem um fluxo de status: draft, review, approved, scheduled, posted

## Isolamento de Dados

Todas as queries no backend filtram por `org_id` para garantir que um usuario so acesse dados da sua organizacao:

```python
# Exemplo: listar influenciadores de uma organizacao
influencers = db.query(Influencer).filter(
    Influencer.org_id == current_org_id
).all()
```

Esse padrao e aplicado consistentemente em todos os endpoints da API, impedindo que dados de uma organizacao sejam acessados por usuarios de outra.

## Fluxo de Selecao de Workspace

No frontend, o usuario seleciona a organizacao e o cost center ativos atraves do **WorkspaceContext**:

1. Apos login, o sistema carrega as organizacoes do usuario (com suas roles)
2. O usuario seleciona a organizacao ativa
3. O usuario seleciona o cost center ativo dentro da organizacao
4. Todas as requisicoes subsequentes filtram pelos IDs selecionados
