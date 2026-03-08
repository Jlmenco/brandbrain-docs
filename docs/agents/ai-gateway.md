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
AI_DEFAULT_PROVIDER=mock       # Para desenvolvimento e testes
AI_DEFAULT_PROVIDER=openai     # Para producao com OpenAI
AI_DEFAULT_PROVIDER=anthropic  # Para producao com Anthropic (Claude)
```

### Modelo Customizado

Por padrao, cada provedor usa seu modelo mais custo-eficiente. Para sobrescrever:

```bash
AI_MODEL=gpt-4o              # Sobrescreve o modelo padrao do OpenAI
AI_MODEL=claude-sonnet-4-5-20241022  # Sobrescreve o modelo padrao do Anthropic
```

Se `AI_MODEL` estiver vazio, o gateway usa o modelo padrao do provedor configurado.

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

| Provedor         | Classe              | Descricao                                            |
|------------------|----------------------|------------------------------------------------------|
| `mock`           | `MockProvider`      | Retorna respostas pre-definidas — usado em dev/testes |
| `openai`         | `OpenAIProvider`    | Integra com a API da OpenAI (GPT + Embeddings)       |
| `anthropic`      | `AnthropicProvider` | Integra com a API da Anthropic (Claude)              |

### 2. Model Registry

Registro centralizado dos modelos disponiveis e suas configuracoes:

| Funcao          | Modelo                     | Dimensoes | Provedor  | Padrao? |
|-----------------|----------------------------|-----------|-----------|---------|
| Chat/Geracao    | gpt-4o-mini                | —         | OpenAI    | Sim     |
| Chat/Geracao    | claude-haiku-4-5-20251001  | —         | Anthropic | Sim     |
| Embeddings      | text-embedding-3-small     | 1536      | OpenAI    | Sim     |

> **Nota:** Embeddings continuam exclusivamente via OpenAI, independente do provedor de geracao de texto. A Anthropic nao oferece modelos de embedding.

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
| `provider`      | Provedor utilizado (mock/openai/anthropic)  |
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

## Implementacao do Provider Anthropic

O provider Anthropic usa o SDK oficial `anthropic` com `AsyncAnthropic`:

```python
from anthropic import AsyncAnthropic

# Inicializacao
client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

# Geracao de texto
response = await client.messages.create(
    model="claude-haiku-4-5-20251001",
    system="Voce e um especialista em marketing...",  # separado das messages
    messages=[{"role": "user", "content": prompt}],
    temperature=0.7,
    max_tokens=1000,
)
result = response.content[0].text
```

**Diferencas chave entre OpenAI e Anthropic:**

| Aspecto          | OpenAI                              | Anthropic                         |
|------------------|-------------------------------------|-----------------------------------|
| System prompt    | Mensagem com `role: "system"`       | Parametro `system` separado       |
| Resposta         | `response.choices[0].message.content` | `response.content[0].text`     |
| Client async     | `AsyncOpenAI`                       | `AsyncAnthropic`                  |
| Embeddings       | Suportado                           | Nao suportado (usar OpenAI)       |

## Adicionando um Novo Provedor

Para adicionar suporte a um novo provedor de LLM:

1. Adicione o SDK ao `requirements.txt`
2. Importe o client com `try/except ImportError` para fallback gracioso
3. Adicione o modelo padrao no dict `DEFAULT_MODELS`
4. Adicione a logica de inicializacao no `__init__` do `AIGateway`
5. Adicione o caso no metodo `generate()`
6. Configure a variavel `AI_DEFAULT_PROVIDER` com o identificador do novo provedor
7. Adicione testes unitarios com mock do SDK
