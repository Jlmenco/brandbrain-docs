---
sidebar_position: 1
---

# Autenticacao

O Brand Brain utiliza autenticacao baseada em **JWT (JSON Web Tokens)** para proteger todos os endpoints da API. Esta pagina descreve como registrar um usuario, obter um token e utiliza-lo nas requisicoes.

## Endpoints de Autenticacao

### POST /auth/register

Registra um novo usuario no sistema.

**Request Body:**

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha_segura_123",
  "full_name": "Nome Completo"
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "email": "usuario@exemplo.com",
  "full_name": "Nome Completo",
  "is_active": true
}
```

### POST /auth/login

Autentica o usuario e retorna um token JWT.

**Request Body (form-data / x-www-form-urlencoded):**

```
username=usuario@exemplo.com
password=senha_segura_123
```

**Response (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## Token JWT

### Algoritmo e Biblioteca

- **Algoritmo:** HS256 (HMAC com SHA-256)
- **Biblioteca:** `python-jose` para geracao e validacao do token no backend

### Payload do Token

O token JWT contém as seguintes claims:

| Claim     | Descricao                              |
|-----------|----------------------------------------|
| `user_id` | UUID do usuario autenticado            |
| `email`   | Email do usuario                       |
| `exp`     | Timestamp de expiracao do token (Unix) |

### Expiracao

O token expira em **24 horas** apos a emissao. Apos a expiracao, o cliente deve realizar um novo login para obter um token valido.

## Como Usar o Token

Todas as requisicoes autenticadas devem incluir o token no header `Authorization` utilizando o esquema **Bearer**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo com cURL

```bash
curl -X GET http://localhost/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Exemplo com fetch (JavaScript)

```javascript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Seguranca de Senhas

As senhas dos usuarios sao armazenadas de forma segura no banco de dados utilizando:

- **Biblioteca:** `passlib` com backend `bcrypt`
- **Versao do bcrypt:** 4.0.1
- **Processo:** As senhas nunca sao armazenadas em texto puro. O `passlib` aplica o algoritmo bcrypt para gerar um hash irreversivel antes de persistir no banco de dados.

## Fluxo de Autenticacao

```
1. Usuario envia POST /auth/login com email e senha
2. Backend valida credenciais contra o hash bcrypt no banco
3. Se valido, gera um token JWT assinado com HS256
4. Cliente armazena o token (localStorage no frontend)
5. Cliente envia o token em todas as requisicoes subsequentes
6. Backend valida o token em cada requisicao protegida
7. Apos 24h, o token expira e o cliente deve re-autenticar
```
