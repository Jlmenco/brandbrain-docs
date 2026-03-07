---
sidebar_position: 2
---

# RBAC (Controle de Acesso Baseado em Roles)

O Brand Brain implementa um sistema de **RBAC** (Role-Based Access Control) que controla o acesso a funcionalidades tanto no backend quanto no frontend. Cada usuario possui uma role dentro de cada organizacao, e essa role determina exatamente o que ele pode fazer.

## Roles Disponiveis

O sistema possui 4 roles, ordenadas do maior para o menor nivel de permissao:

| Role | Descricao |
|------|-----------|
| **owner** | Proprietario da organizacao. Acesso total a todas as operacoes. |
| **admin** | Administrador. Mesmo nivel de acesso do owner. |
| **editor** | Pode criar e editar conteudo, mas nao pode aprovar ou publicar. |
| **viewer** | Somente leitura. Nao pode criar, editar ou alterar nada. |

## Matriz de Permissoes

| Operacao | Owner | Admin | Editor | Viewer |
|----------|:-----:|:-----:|:------:|:------:|
| Visualizar conteudo | Sim | Sim | Sim | Sim |
| Visualizar influenciadores | Sim | Sim | Sim | Sim |
| Visualizar dashboard e metricas | Sim | Sim | Sim | Sim |
| Visualizar audit logs | Sim | Sim | Sim | Sim |
| Criar conteudo | Sim | Sim | Sim | Nao |
| Editar conteudo | Sim | Sim | Sim | Nao |
| Submeter para revisao | Sim | Sim | Sim | Nao |
| Aprovar conteudo | Sim | Sim | Nao | Nao |
| Solicitar alteracoes | Sim | Sim | Nao | Nao |
| Rejeitar conteudo | Sim | Sim | Nao | Nao |
| Agendar publicacao | Sim | Sim | Nao | Nao |
| Publicar agora | Sim | Sim | Nao | Nao |
| Criar/editar influenciadores | Sim | Sim | Nao | Nao |
| Editar brand kit | Sim | Sim | Nao | Nao |
| Criar/editar cost centers | Sim | Sim | Nao | Nao |
| Gerenciar campanhas | Sim | Sim | Nao | Nao |
| Gerenciar leads | Sim | Sim | Sim | Nao |

## Constantes de Agrupamento

Para simplificar a verificacao de permissoes, o backend define duas constantes de agrupamento:

```python
ADMIN_ROLES = ("owner", "admin")
EDITOR_ROLES = ("owner", "admin", "editor")
```

- **ADMIN_ROLES**: usado em operacoes administrativas (aprovar, rejeitar, agendar, publicar, CRUD de influenciadores e cost centers)
- **EDITOR_ROLES**: usado em operacoes de edicao (criar e editar conteudo, submeter para revisao, gerenciar leads)

## Enforcement no Backend

O backend aplica RBAC em todos os endpoints de escrita atraves da funcao `check_role()`:

```python
def check_role(
    db: Session,
    user_id: int,
    org_id: int,
    allowed_roles: tuple[str, ...]
) -> OrgMember:
    """
    Verifica se o usuario possui uma das roles permitidas
    na organizacao. Levanta HTTP 403 caso contrario.
    """
    member = db.query(OrgMember).filter(
        OrgMember.user_id == user_id,
        OrgMember.org_id == org_id
    ).first()

    if not member or member.role not in allowed_roles:
        raise HTTPException(status_code=403, detail="Permissao insuficiente")

    return member
```

### Exemplos de Uso nos Endpoints

```python
# Somente owner/admin podem aprovar conteudo
@router.post("/{item_id}/approve")
def approve_content(item_id: int, db: Session, user: User):
    org_id = _get_org_id(db, item.cost_center_id)
    check_role(db, user.id, org_id, ADMIN_ROLES)
    # ... logica de aprovacao

# Owner/admin/editor podem criar conteudo
@router.post("/")
def create_content(payload: ContentCreate, db: Session, user: User):
    org_id = _get_org_id(db, payload.cost_center_id)
    check_role(db, user.id, org_id, EDITOR_ROLES)
    # ... logica de criacao
```

### Resolucao de org_id

Nem todos os endpoints recebem `org_id` diretamente. O backend resolve o `org_id` a partir da entidade sendo manipulada:

- **Content Items**: resolve via `cost_center.org_id`
- **Influencers**: resolve via `influencer.org_id`
- **Cost Centers**: resolve via `cost_center.org_id` (update) ou query param (create)

## Enforcement no Frontend

O frontend implementa RBAC de duas formas complementares:

### Componente `<Gate>`

O componente `<Gate>` permite gating declarativo de elementos da UI:

```tsx
import { Gate } from "@/components/ui/gate";

// So exibe o botao para quem tem permissao de criar conteudo
<Gate permission="content:create">
  <Button onClick={handleCreate}>Novo Conteudo</Button>
</Gate>
```

Se o usuario nao possui a permissao especificada, o conteudo dentro do `<Gate>` nao e renderizado.

### Funcao `can()` do WorkspaceContext

Para verificacoes programaticas, o `WorkspaceContext` expoe a funcao `can()`:

```tsx
const { can } = useWorkspace();

if (can("content:approve")) {
  // exibir botao de aprovacao
}
```

### Mapa de Permissoes

O arquivo `lib/permissions.ts` define o mapa completo de permissoes por role:

```typescript
type Permission =
  | "content:create"
  | "content:edit"
  | "content:submit"
  | "content:approve"
  | "content:reject"
  | "content:schedule"
  | "content:publish"
  | "influencer:create"
  | "influencer:edit"
  | "brand_kit:edit"
  | "cost_center:manage"
  | "campaign:manage"
  | "lead:manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [/* todas as permissoes */],
  admin: [/* todas as permissoes */],
  editor: ["content:create", "content:edit", "content:submit", "lead:manage"],
  viewer: [],
};
```

## Testes

O sistema possui 18 testes dedicados de RBAC em `test_rbac.py` que validam:

- Que editores podem criar e editar conteudo
- Que editores **nao** podem aprovar ou rejeitar conteudo
- Que viewers **nao** podem criar ou editar nada
- Que usuarios de fora da organizacao recebem 403
- Que admins e owners podem executar todas as operacoes
