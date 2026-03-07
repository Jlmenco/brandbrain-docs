---
sidebar_position: 3
---

# AI Gateway

O AI Gateway e a camada de abstracao que **isola o produto de provedores especificos de LLM**, permitindo trocar, combinar e monitorar provedores de IA sem alterar o codigo do negocio.

## Proposito

Centralizar todas as chamadas de IA em um unico ponto de controle, oferecendo:

- **Independencia de provedor:** trocar de OpenAI para outro provedor sem alterar o codigo do produto
- **Monitoramento:** logging de todas as chamadas, custos e latencias
- **Resiliencia:** fallback automatico e circuit breaker em caso de falhas
- **Governanca:** politicas de uso, limites de custo e auditoria

## Configuracao

O provedor padrao e configurado via variavel de ambiente:

```bash
AI_DEFAULT_PROVIDER=mock    # Para desenvolvimento e testes
AI_DEFAULT_PROVIDER=openai  # Para producao com OpenAI
```

## Componentes

O AI Gateway e composto por 5 componentes principais:

### 1. LLM Adapter Interface

Interface abstrata que define o contrato para todos os provedores de LLM. Qualquer novo provedor deve implementar esta interface.

```python
class LLMAdapter:
    async def generate(self, prompt: str, **kwargs) -> str:
        """Gera texto a partir de um prompt."""
        ...

    async def embed(self, text: str) -> list[float]:
        """Gera embedding vetorial do texto."""
        ...
```

**Implementacoes atuais:**

| Provedor         | Classe            | Descricao                                            |
|------------------|-------------------|------------------------------------------------------|
| `mock`           | `MockProvider`    | Retorna respostas pre-definidas — usado em dev/testes |
| `openai`         | `OpenAIProvider`  | Integra com a API da OpenAI (GPT + Embeddings)       |

### 2. Model Registry

Registro centralizado dos modelos disponiveis e suas configuracoes:

| Funcao          | Modelo                     | Dimensoes | Provedor |
|-----------------|----------------------------|-----------|----------|
| Chat/Geracao    | gpt-4o (ou mock)           | —         | OpenAI   |
| Embeddings      | text-embedding-3-small     | 1536      | OpenAI   |

### 3. Policy Engine

Motor de politicas que controla o uso dos provedores de IA:

- **Rate limiting:** Limite de chamadas por minuto/hora por organizacao
- **Cost caps:** Teto de custo diario/mensal por organizacao
- **Content filtering:** Validacao do conteudo gerado antes de retornar ao usuario
- **Model routing:** Regras para direcionar chamadas para modelos especificos baseado no tipo de tarefa

### 4. Prompt Logger

Registra todas as interacoes com os provedores de IA para auditoria e debugging:

| Campo           | Descricao                                   |
|-----------------|---------------------------------------------|
| `timestamp`     | Data/hora da chamada                        |
| `provider`      | Provedor utilizado (mock/openai)            |
| `model`         | Modelo especifico utilizado                 |
| `prompt`        | Prompt enviado (truncado se necessario)     |
| `response`      | Resposta recebida (truncada se necessario)  |
| `tokens_in`     | Quantidade de tokens de entrada             |
| `tokens_out`    | Quantidade de tokens de saida               |
| `cost`          | Custo estimado da chamada                   |
| `latency_ms`    | Latencia da chamada em milissegundos        |
| `org_id`        | Organizacao que originou a chamada          |

### 5. Fallback e Circuit Breaker

Mecanismo de resiliencia para lidar com falhas dos provedores:

**Fallback:**
- Se o provedor primario falha, o gateway tenta automaticamente o provedor secundario
- Ordem de fallback configuravel por organizacao

**Circuit Breaker:**
- Monitora a taxa de erro das chamadas ao provedor
- **Fechado (normal):** Chamadas passam normalmente
- **Aberto (falha):** Apos N falhas consecutivas, bloqueia chamadas e usa fallback
- **Meio-aberto (recuperacao):** Permite chamadas de teste para verificar se o provedor se recuperou

```
Normal → N falhas → Circuit Open → Timeout → Half-Open → Sucesso → Fechado
                                                        → Falha → Aberto
```

## Embeddings e RAG

O AI Gateway gerencia a geracao de embeddings para o sistema de RAG (Retrieval-Augmented Generation):

### Modelo de Embedding

- **Modelo:** `text-embedding-3-small`
- **Dimensoes:** 1536
- **Uso:** Vetorizacao dos campos do brand kit para busca semantica

### Fluxo de Embedding

```
Brand Kit criado/atualizado
    ↓
AI Gateway recebe texto dos campos
    ↓
text-embedding-3-small gera vetor [1536 dims]
    ↓
Vetor armazenado na tabela BrandKitEmbedding (pgvector)
    ↓
Disponivel para busca por similaridade coseno
```

### Campos Embedados

Os seguintes campos do brand kit sao convertidos em embeddings:

| Campo               | Descricao                                         |
|---------------------|---------------------------------------------------|
| `description`       | Descricao geral do influenciador/marca            |
| `value_props`       | Propostas de valor                                |
| `products`          | Produtos e servicos                               |
| `audience`          | Publico-alvo                                      |
| `style_guidelines`  | Diretrizes de estilo e tom de voz                 |

## Fluxo Completo de uma Chamada

```
Codigo do produto (Agent/Service)
    ↓
AI Gateway.generate(prompt, model, params)
    ↓
Policy Engine: verifica limites e politicas
    ↓
Prompt Logger: registra a chamada
    ↓
LLM Adapter: envia para o provedor configurado
    ↓
Resposta do provedor
    ↓
Prompt Logger: registra resposta, tokens, custo
    ↓
Retorna para o codigo do produto
```

Em caso de falha:

```
LLM Adapter: falha no provedor primario
    ↓
Circuit Breaker: avalia estado
    ↓
Fallback: tenta provedor secundario
    ↓
Se todos falharem: retorna erro com detalhes
```

## Adicionando um Novo Provedor

Para adicionar suporte a um novo provedor de LLM:

1. Crie uma nova classe que implemente a interface `LLMAdapter`
2. Registre o provedor no `Model Registry`
3. Configure a variavel `AI_DEFAULT_PROVIDER` com o identificador do novo provedor
4. Adicione regras de fallback no circuit breaker, se desejado

```python
class AnthropicProvider(LLMAdapter):
    async def generate(self, prompt: str, **kwargs) -> str:
        # Implementacao com a API da Anthropic
        ...

    async def embed(self, text: str) -> list[float]:
        # Anthropic nao oferece embeddings — usar fallback
        raise NotImplementedError("Use OpenAI para embeddings")
```
