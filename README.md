# BESS Peak Shaving Dimensioner

> Aplicação web para dimensionamento e análise de viabilidade de sistemas de armazenamento de energia (BESS) voltados para peak shaving industrial e comercial.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Funcionalidades

### ✅ Implementadas

- **Gerador de Casos de Teste** - Crie dados realistas para testes
  - 5 estágios de empresa (10 kW até 5.000 kW)
  - 3 níveis de severidade (leve, moderado, grave)
  - Curva de carga industrial realista
  - Exportação em formato Excel

- **Upload e Análise de Dados**
  - Suporta formato Elspec (timestamps + potência)
  - Análise automática de picos de demanda
  - Classificação por horário tarifário
  - Gráficos interativos

- **Configuração de Tarifas**
  - Suporte a múltiplas estruturas tarifárias
  - Padrão CEMIG Uberaba pré-configurado
  - Customização completa

- **Dimensionamento de BESS**
  - Cálculo automático de potência (kW)
  - Cálculo automático de capacidade (kWh)
  - Análise de custo por kWh e kW
  - Estimativa de economia anual

- **Simulação Dia a Dia**
  - 2 estratégias de carregamento (solar vs madrugada)
  - Simulação completa do período
  - Cálculo de payback e ROI
  - Gráficos de resultado

- **Interface Elegante**
  - Design moderno e intuitivo
  - Responsivo (desktop, tablet, mobile)
  - Temas claro/escuro
  - Feedback visual em tempo real

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 22+
- Python 3.11+
- SQLite 3.x

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd bess-shaving-app

# Instale dependências
pnpm install

# Configure banco de dados
pnpm db:push

# Inicie servidor de desenvolvimento
pnpm dev
```

Acesse: `http://localhost:3000`

---

## 📖 Documentação

### Guias Principais

- **[Guia de Uso](./docs/04-GUIA-USO.md)** - Como usar a aplicação
- **[Arquitetura](./docs/01-ARQUITETURA.md)** - Visão técnica do sistema
- **[Banco de Dados](./docs/02-BANCO-DE-DADOS.md)** - Schema e estrutura
- **[Tarifas CEMIG](./docs/02-TARIFAS-CEMIG-UBERABA.md)** - Valores padrão
- **[Gerador de Casos](./docs/03-GERADOR-CASOS-TESTE.md)** - Como gerar dados

### Estrutura de Diretórios

```
bess-shaving-app/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principais
│   │   ├── components/       # Componentes React
│   │   │   └── bess/        # Componentes BESS
│   │   └── lib/             # Utilitários
│   └── public/              # Assets estáticos
├── server/                   # Backend Node.js/Express
│   ├── python-workers/      # Scripts Python
│   │   ├── gerador_casos_teste.py
│   │   ├── parser_excel.py
│   │   ├── dimensionador_bess.py
│   │   └── simulador_bess.py
│   ├── routers/             # Rotas tRPC
│   └── _core/               # Framework core
├── drizzle/                 # Migrations SQLite
├── docs/                    # Documentação
└── uploads/                 # Armazenamento local
```

---

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor com hot-reload

# Build
pnpm build            # Build para produção
pnpm start            # Inicia servidor produção

# Testes
pnpm test             # Executa testes vitest

# Qualidade
pnpm check            # Verifica tipos TypeScript
pnpm format           # Formata código

# Banco de Dados
pnpm db:push          # Aplica migrations
```

### Módulos Python

#### Gerador de Casos de Teste

```bash
python3 server/python-workers/gerador_casos_teste.py \
  --stage 3 \
  --severity moderado \
  --days 30 \
  --output caso_teste.xlsx
```

#### Parser de Excel

```bash
python3 server/python-workers/parser_excel.py \
  --file dados.xlsx \
  --analyze
```

#### Dimensionador BESS

```bash
python3 server/python-workers/dimensionador_bess.py \
  --reduction 20 \
  --cost 200000
```

#### Simulador BESS

```bash
python3 server/python-workers/simulador_bess.py \
  --capacity 324 \
  --power 90 \
  --strategy grid-offpeak
```

---

## 📊 Fluxo de Uso

```
┌─────────────────────────────────────────────────────────┐
│  1. GERAR CASO DE TESTE (Opcional)                      │
│     - Selecionar tamanho empresa, severidade, dias      │
│     - Download arquivo Excel                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. UPLOAD DE ARQUIVO                                   │
│     - Selecionar arquivo Excel (Elspec)                 │
│     - Validar formato e dados                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. ANÁLISE DE CURVA                                    │
│     - Identificar picos de demanda                      │
│     - Classificar por horário tarifário                 │
│     - Exibir gráficos e estatísticas                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. CONFIGURAÇÃO DE TARIFAS                             │
│     - Definir preços (ponta, intermediária, fora-ponta) │
│     - Cobrança de demanda                               │
│     - Carregar padrão CEMIG (opcional)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  5. DIMENSIONAMENTO                                     │
│     - Calcular potência BESS (kW)                       │
│     - Calcular capacidade BESS (kWh)                    │
│     - Estimar economia anual                            │
│     - Calcular payback e ROI                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  6. SIMULAÇÃO                                           │
│     - Escolher estratégia (solar vs madrugada)          │
│     - Simular dia a dia                                 │
│     - Visualizar resultados                             │
│     - Exportar relatório                                │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Exemplo de Resultado

### Indústria Média - Carregamento Madrugada

**Entrada:**
- Demanda: 400 kW
- Pico: 450 kW
- Tarifa ponta: R$ 1,71/kWh
- Tarifa fora-ponta: R$ 0,72/kWh
- Cobrança demanda: R$ 50/kW/mês
- Investimento: R$ 200.000

**Saída:**
- Potência BESS: 90 kW
- Capacidade BESS: 324 kWh
- Economia anual: R$ 97.088
- Payback: 2,1 anos ✅
- ROI 10 anos: 385%

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **Recharts** - Gráficos interativos
- **Shadcn/ui** - Componentes UI
- **Wouter** - Roteamento

### Backend
- **Express 4** - Web framework
- **tRPC 11** - RPC type-safe
- **Drizzle ORM** - Database ORM
- **SQLite 3** - Database

### Python
- **Pandas** - Data processing
- **Openpyxl** - Excel handling
- **NumPy** - Cálculos numéricos

### DevOps
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **ESBuild** - Bundler

---

## 📋 Requisitos de Entrada

### Arquivo Excel (Elspec)

```
Coluna A: Timestamps (DD/MM/YYYY HH:MM:SS.000000)
Coluna B: Potência Ativa (kW)

Exemplo:
26/12/2025 00:00:00.000000 | 150.5
26/12/2025 01:00:00.000000 | 148.2
26/12/2025 02:00:00.000000 | 145.8
```

### Configuração de Tarifas

```json
{
  "tarifa_ponta": 1.71,           // R$/kWh (18-21h seg-sex)
  "tarifa_intermediaria": 1.12,   // R$/kWh (17-22h seg-sex)
  "tarifa_fora_ponta": 0.72,      // R$/kWh (resto)
  "cobranca_demanda": 50.0        // R$/kW/mês
}
```

---

## 📤 Saídas Geradas

### Análise
- Gráficos de curva de carga
- Estatísticas por horário tarifário
- Identificação de picos

### Dimensionamento
- Potência e capacidade recomendadas
- Análise de custos
- Estimativa de economia

### Simulação
- Resultados dia a dia
- Gráficos comparativos
- Análise de payback

---

## 🔐 Segurança

- ✅ Sem autenticação (uso local)
- ✅ Sem upload para cloud (dados locais)
- ✅ SQLite com dados persistentes
- ✅ Validação de entrada
- ✅ Tratamento de erros

---

## 📝 Licença

MIT License - Veja LICENSE.md para detalhes

---

## 👨‍💻 Desenvolvimento

### Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Roadmap

- [ ] Integração com OpenDSS para validação técnica
- [ ] Suporte a múltiplas moedas
- [ ] Exportação de relatórios em PDF
- [ ] Dashboard com histórico de análises
- [ ] API pública para integração
- [ ] Suporte a diferentes tecnologias de bateria
- [ ] Análise de degradação de bateria

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [Documentação](./docs/)
2. Revise [Exemplos](./docs/04-GUIA-USO.md#exemplos-práticos)
3. Abra uma issue no repositório

---

## 🙏 Agradecimentos

Desenvolvido com dedicação para engenheiros e consultores de energia.

---

**Versão:** 1.0.0  
**Data:** Dezembro 2025  
**Status:** Production Ready ✅
