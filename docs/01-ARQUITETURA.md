# Arquitetura do Sistema BESS Peak Shaving Dimensioner

## Visão Geral

A aplicação **BESS Peak Shaving Dimensioner** é uma ferramenta web para dimensionamento e análise de viabilidade de sistemas de armazenamento de energia (BESS - Battery Energy Storage System) voltados para **peak shaving** em ambientes industriais e comerciais.

O sistema processa dados de qualímetros (medidores de qualidade de energia), analisa padrões de consumo, dimensiona automaticamente sistemas de baterias e simula cenários de operação para calcular economia financeira e payback.

**Características principais:**
- ✅ Sem autenticação (acesso direto)
- ✅ Armazenamento local (sem cloud)
- ✅ Interface elegante e intuitiva
- ✅ Processamento rápido de dados
- ✅ Simulações detalhadas dia a dia

## Stack Tecnológico

### Frontend
- **React 19** - Framework UI moderno com hooks
- **Tailwind CSS 4** - Estilização utilitária e responsiva
- **Recharts** - Gráficos interativos para visualização de dados
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Bundler rápido e moderno

### Backend
- **Node.js + Express** - Servidor web e API
- **tRPC 11** - RPC type-safe para comunicação frontend-backend
- **Python 3.11** - Análise numérica e simulações
- **FastAPI** - Servidor Python para processamento pesado

### Banco de Dados
- **SQLite** - Banco de dados leve e sem dependências externas
- **Drizzle ORM** - ORM type-safe com migrations automáticas
- **Better SQLite3** - Driver SQLite de alto desempenho

### Armazenamento
- **Sistema de arquivos local** - Uploads salvos em pasta local
- **Sem dependências externas** - Tudo roda localmente

## Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  - Upload de arquivos Excel                                │
│  - Configuração de tarifas                                 │
│  - Visualização de gráficos                                │
│  - Simulação interativa                                    │
│  - Relatórios e análises                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ tRPC / HTTP
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               API LAYER (Node.js + tRPC)                    │
│  - Endpoints para upload de arquivos                       │
│  - Configuração de tarifas                                 │
│  - Orquestração de simulações                              │
│  - Gerenciamento de arquivos locais                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ Python subprocess / HTTP
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          PROCESSAMENTO (Python + FastAPI)                   │
│  - Parser de arquivos Excel                                │
│  - Análise de curva de carga                               │
│  - Algoritmo de dimensionamento BESS                       │
│  - Simulação dia a dia                                     │
│  - Cálculos financeiros                                    │
│  - Integração com OpenDSS                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PERSISTÊNCIA (SQLite + Drizzle)                │
│  - Configurações tarifárias                                │
│  - Simulações e resultados                                 │
│  - Dados de perfil de carga                                │
│  - Histórico de análises                                   │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados Principal

### 1. Upload e Processamento de Arquivo

```
Usuário seleciona arquivo Excel
        ↓
Frontend envia para tRPC endpoint
        ↓
Backend valida e armazena localmente
        ↓
Python parser lê arquivo
        ↓
Extrai timestamps e potência (kW)
        ↓
Calcula estatísticas (pico, média, mín)
        ↓
Armazena no banco de dados
        ↓
Retorna ao frontend para confirmação
```

### 2. Configuração de Tarifas

```
Usuário define horários e preços
        ↓
Frontend valida dados
        ↓
tRPC salva configuração no banco
        ↓
Ativação para próximas simulações
```

### 3. Dimensionamento e Simulação

```
Usuário inicia simulação
        ↓
Backend recupera dados do upload
        ↓
Python calcula potência (kW) necessária
        ↓
Python calcula capacidade (kWh) necessária
        ↓
Simula dia a dia com estratégia de carregamento
        ↓
Calcula economia e payback
        ↓
Armazena resultados no banco
        ↓
Frontend exibe gráficos e análises
```

## Estrutura de Diretórios

```
bess-shaving-app/
├── docs/                          # Documentação do projeto
│   ├── 01-ARQUITETURA.md         # Este arquivo
│   ├── 02-BANCO-DE-DADOS.md      # Schema e modelos
│   ├── 03-API-ENDPOINTS.md       # Endpoints tRPC
│   ├── 04-PROCESSAMENTO.md       # Lógica Python
│   ├── 05-FRONTEND.md            # Componentes React
│   └── 06-GUIA-DESENVOLVIMENTO.md # Como desenvolver
│
├── client/                        # Frontend React
│   ├── src/
│   │   ├── pages/                # Páginas principais
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── lib/                  # Utilitários e tRPC
│   │   ├── contexts/             # React contexts
│   │   └── App.tsx               # Roteamento principal
│   ├── public/                   # Arquivos estáticos
│   └── index.html                # HTML principal
│
├── server/                        # Backend Node.js
│   ├── routers.ts                # Endpoints tRPC
│   ├── db.ts                     # Queries do banco
│   ├── python-workers/           # Subprocessos Python
│   │   ├── processador.py        # Parser e análise
│   │   ├── dimensionador.py      # Cálculos BESS
│   │   ├── simulador.py          # Simulação dia a dia
│   │   └── financeiro.py         # Análise financeira
│   └── _core/                    # Framework interno
│
├── drizzle/                       # Banco de dados
│   ├── schema.ts                 # Definição de tabelas
│   └── migrations/               # Histórico de migrations
│
├── shared/                        # Código compartilhado
│   └── types.ts                  # Tipos TypeScript
│
├── uploads/                       # Arquivos locais
│   └── *.xlsm                    # Arquivos Excel enviados
│
└── package.json                  # Dependências do projeto
```

## Segurança

- **Sem autenticação:** Acesso direto à aplicação
- **Validação de entrada:** Verificação de tipos e formatos
- **Isolamento de processos:** Python workers em subprocessos
- **Permissões de arquivo:** Apenas leitura/escrita local
- **HTTPS:** Recomendado em produção

## Performance

- **Frontend:** Vite com hot module replacement (HMR)
- **Backend:** tRPC com cache de queries
- **Processamento:** Python com NumPy para cálculos vetorizados
- **Banco de dados:** SQLite com índices otimizados
- **Gráficos:** Recharts com renderização eficiente
- **Uploads:** Processamento assíncrono

## Escalabilidade

A arquitetura atual é otimizada para:
- Análise de 1-12 meses de dados (288-3456 pontos horários)
- Múltiplas simulações simultâneas
- Processamento rápido (< 5 segundos por simulação)
- Armazenamento local (sem limite de cloud)

## Fluxo de Desenvolvimento

1. **Frontend:** React com componentes reutilizáveis
2. **Backend:** tRPC procedures para cada funcionalidade
3. **Processamento:** Python workers para cálculos pesados
4. **Banco:** SQLite para persistência
5. **Testes:** Vitest para testes unitários

## Próximos Passos

1. ✅ Configurar SQLite e schema
2. ⏳ Criar componentes React
3. ⏳ Implementar processador Python
4. ⏳ Integrar simulações
5. ⏳ Adicionar relatórios
