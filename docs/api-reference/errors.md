---
sidebar_position: 3
---

# Codigos de Erro

A API do Brand Brain utiliza codigos de status HTTP padrao para indicar o resultado de cada requisicao. Esta pagina documenta todos os codigos de erro possiveis, suas causas e como resolve-los.

## Visao Geral

| Codigo | Nome                   | Descricao Resumida                        |
|--------|------------------------|-------------------------------------------|
| 400    | Bad Request            | Dados de entrada invalidos                |
| 401    | Unauthorized           | Token JWT ausente ou invalido             |
| 403    | Forbidden              | Permissao insuficiente para a acao        |
| 404    | Not Found              | Recurso nao encontrado                    |
| 409    | Conflict               | Recurso duplicado                         |
| 422    | Unprocessable Entity   | Erro de validacao nos dados enviados      |
| 500    | Internal Server Error  | Erro interno do servidor                  |

---

## Detalhamento dos Erros

### 400 Bad Request

**Causa:** Os dados enviados na requisicao sao invalidos ou estao em formato incorreto.

**Formato da resposta:**

```json
{
  "detail": "Descricao do erro especifico"
}
```

**Exemplos de causas:**
- Campo obrigatorio ausente no body da requisicao
- Tipo de dado incorreto (ex: string onde se espera um inteiro)
- Valor fora do range permitido
- Transicao de status invalida no workflow de conteudo (ex: tentar aprovar um conteudo que nao esta em revisao)

---

### 401 Unauthorized

**Causa:** O token JWT esta ausente, expirado ou invalido.

**Formato da resposta:**

```json
{
  "detail": "Could not validate credentials"
}
```

**Exemplos de causas:**
- Header `Authorization` ausente na requisicao
- Token JWT expirado (validade de 24 horas)
- Token JWT malformado ou assinado com chave incorreta
- Header no formato incorreto (deve ser `Bearer <token>`)

**Como resolver:**
1. Verifique se o header `Authorization: Bearer <token>` esta presente
2. Caso o token tenha expirado, faca um novo login via `POST /auth/login`
3. Verifique se o token nao foi alterado apos a emissao

---

### 403 Forbidden

**Causa:** O usuario autenticado nao possui a role (papel) necessaria para executar a acao solicitada.

**Formato da resposta:**

```json
{
  "detail": "Insufficient permissions"
}
```

**Sistema de roles:**

| Role     | Permissoes                                                    |
|----------|---------------------------------------------------------------|
| `owner`  | Acesso total a todas as operacoes                             |
| `admin`  | Acesso total a todas as operacoes                             |
| `editor` | Criar e editar conteudos, enviar para revisao                 |
| `viewer` | Somente leitura em todos os recursos                          |

**Exemplos de causas:**
- Um `viewer` tentando criar um conteudo (requer `editor` ou superior)
- Um `editor` tentando aprovar um conteudo (requer `admin` ou `owner`)
- Um `editor` tentando criar um influenciador (requer `admin` ou `owner`)

**Como resolver:**
- Verifique se o usuario possui a role adequada para a operacao
- Consulte a [referencia de endpoints](./endpoints) para saber a role minima de cada endpoint
- Solicite a um `owner` ou `admin` a alteracao da sua role, se necessario

---

### 404 Not Found

**Causa:** O recurso solicitado nao existe ou nao pertence a organizacao do usuario.

**Formato da resposta:**

```json
{
  "detail": "Resource not found"
}
```

**Exemplos de causas:**
- ID de conteudo, influenciador, campanha ou lead inexistente
- Recurso pertencente a outra organizacao
- URL do endpoint incorreta

**Como resolver:**
- Verifique se o ID do recurso esta correto
- Confirme que o recurso pertence a organizacao do usuario logado
- Verifique a URL do endpoint consultando a [referencia de endpoints](./endpoints)

---

### 409 Conflict

**Causa:** A operacao resultaria em um recurso duplicado, violando uma restricao de unicidade.

**Formato da resposta:**

```json
{
  "detail": "Resource already exists"
}
```

**Exemplos de causas:**
- Tentativa de registrar um usuario com email ja existente
- Criacao de recurso com identificador unico duplicado

**Como resolver:**
- Verifique se o recurso ja existe antes de tentar cria-lo
- Utilize um identificador diferente

---

### 422 Unprocessable Entity

**Causa:** Os dados enviados falharam na validacao do FastAPI/Pydantic. Este e o erro padrao de validacao do FastAPI.

**Formato da resposta:**

```json
{
  "detail": [
    {
      "loc": ["body", "nome_do_campo"],
      "msg": "descricao do erro de validacao",
      "type": "tipo_do_erro"
    }
  ]
}
```

**Exemplos de causas:**
- Campo `email` com formato invalido
- Campo numerico recebendo texto
- Enum com valor nao permitido (ex: plataforma invalida)
- Campos obrigatorios com valor `null`

**Como resolver:**
- Leia o campo `loc` para identificar qual campo falhou
- Leia o campo `msg` para entender o motivo da falha
- Corrija o valor do campo de acordo com o schema esperado

---

### 500 Internal Server Error

**Causa:** Erro inesperado no servidor. Indica um problema interno que nao deveria ocorrer em operacao normal.

**Formato da resposta:**

```json
{
  "detail": "Internal server error"
}
```

**Exemplos de causas:**
- Falha na conexao com o banco de dados
- Erro nao tratado no codigo do backend
- Falha na comunicacao com servico externo (Redis, provedor de IA)

**Como resolver:**
- Verifique os logs do servidor para obter detalhes do erro
- Se o erro persistir, reporte para a equipe de desenvolvimento
- Em ambiente Docker: `docker logs bb_api` para visualizar logs do backend

---

## Boas Praticas para Tratamento de Erros

1. **Sempre verifique o codigo de status** da resposta antes de processar o body
2. **Trate o 401** redirecionando o usuario para a tela de login
3. **Exiba mensagens amigaveis** para o usuario final, traduzindo os erros tecnicos
4. **Implemente retry** com backoff para erros 500 temporarios
5. **Valide os dados no frontend** antes de enviar para a API, evitando erros 422 desnecessarios
