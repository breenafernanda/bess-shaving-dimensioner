# Guia de Uso - BESS Peak Shaving Dimensioner

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fluxo Principal](#fluxo-principal)
3. [Gerador de Casos de Teste](#gerador-de-casos-de-teste)
4. [Análise de BESS](#análise-de-bess)
5. [Interpretação de Resultados](#interpretação-de-resultados)
6. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Visão Geral

A aplicação **BESS Peak Shaving Dimensioner** foi desenvolvida para:

- ✅ Analisar curvas de carga de empresas
- ✅ Dimensionar sistemas de armazenamento de energia (BESS)
- ✅ Simular diferentes estratégias de carregamento
- ✅ Calcular economia anual e payback
- ✅ Gerar relatórios com recomendações técnicas

**Público-alvo:** Engenheiros, consultores de energia, gerentes de operações

---

## 🔄 Fluxo Principal

### Passo 1: Gerar Caso de Teste (Opcional)

Se você não possui dados reais, use o **Gerador de Casos de Teste**:

1. Acesse: `/test-case-generator`
2. Selecione o tamanho da empresa (5 estágios disponíveis)
3. Escolha o nível de severidade (leve, moderado, grave)
4. Defina o período de análise (7 a 365 dias)
5. Clique em "Gerar Caso de Teste"
6. Download do arquivo Excel gerado

**Resultado:** Arquivo Excel com curva de carga realista para testes

### Passo 2: Análise de BESS

Acesse: `/bess-analysis`

#### 2.1 Upload de Arquivo

- Selecione arquivo Excel no formato Elspec
- Formato esperado:
  - Coluna A: Timestamps (DD/MM/YYYY HH:MM:SS.000000)
  - Coluna B: Potência ativa em kW

#### 2.2 Análise de Curva

A aplicação automaticamente:
- Identifica picos de demanda
- Classifica consumo por horário tarifário
- Calcula potencial de peak shaving
- Exibe gráficos interativos

#### 2.3 Configuração de Tarifas

Configure as tarifas de sua concessionária:
- **Tarifa Ponta:** Horário 18-21h (seg-sex)
- **Tarifa Intermediária:** Horário 17-22h (seg-sex, exceto ponta)
- **Tarifa Fora-Ponta:** Resto do dia
- **Cobrança de Demanda:** R$/kW/mês

**Padrão:** CEMIG Uberaba MG (carregável com um clique)

#### 2.4 Dimensionamento

A aplicação calcula:
- Potência necessária do BESS (kW)
- Capacidade necessária do BESS (kWh)
- Custo por kWh e por kW
- Economia anual estimada
- Payback period
- ROI em 10 anos

**Parâmetros ajustáveis:**
- Redução de demanda desejada (5-50%)
- Custo de investimento (R$)

#### 2.5 Simulação

Escolha a estratégia de carregamento:

**Opção 1: Carregamento Solar**
- BESS carrega durante o dia com geração própria
- Sem custo de carregamento
- Ideal para empresas com painéis solares

**Opção 2: Carregamento na Madrugada**
- BESS carrega entre 00-06h com tarifa baixa
- Custo de carregamento = energia × tarifa fora-ponta
- Ideal para empresas sem geração própria

**Resultado:** Simulação dia a dia com:
- Economia diária
- Estado de carga (SOC) do BESS
- Comparação demanda original vs otimizada
- Gráficos interativos

---

## 🧪 Gerador de Casos de Teste

### Estágios de Empresa

| Estágio | Descrição | Range de Demanda |
|---------|-----------|------------------|
| 1 | Pequeno Comércio | 10 - 50 kW |
| 2 | Pequena Indústria | 50 - 150 kW |
| 3 | Indústria Média | 150 - 500 kW |
| 4 | Indústria Grande | 500 - 1.500 kW |
| 5 | Indústria Pesada | 1.500 - 5.000 kW |

### Níveis de Severidade

| Nível | Variabilidade | Picos | Uso |
|-------|---------------|-------|-----|
| **Leve** | ±5% | até 10% acima demanda | Consumo regular |
| **Moderado** | ±15% | até 25% acima demanda | Consumo oscilante |
| **Grave** | ±30% | até 50% acima demanda | Consumo muito variável |

### Padrão de Curva de Carga Industrial

A curva gerada segue o padrão industrial típico:

```
Consumo (pu)
1.0 |                    ████████
    |                ████████████████
0.8 |            ████████        ████████
    |        ████████                ████████
0.6 |    ████████                        ████████
    |████████                                ████████
0.4 |
    |
0.2 |
    |
    └─────────────────────────────────────────────
      00  06  12  18  24 (hora)
```

- **00-06h:** Madrugada (consumo mínimo)
- **06-12h:** Manhã (subida gradual)
- **12-13h:** Almoço (pequena queda)
- **13-18h:** Tarde (recuperação)
- **18-22h:** Ponta (pico máximo)
- **22-24h:** Noite (queda)

---

## 📊 Análise de BESS

### Métricas Principais

#### Dimensionamento

- **Potência (kW):** Capacidade de descarga instantânea
- **Capacidade (kWh):** Energia total armazenada
- **Custo/kWh:** Investimento por unidade de energia
- **Custo/kW:** Investimento por unidade de potência

#### Economia

- **Economia de Demanda:** Redução de cobrança de demanda contratada
- **Economia de Energia:** Diferença entre tarifa ponta e fora-ponta
- **Economia Total Anual:** Soma das duas economias

#### Viabilidade

- **Payback:** Tempo para recuperar investimento (anos)
- **ROI 10 anos:** Retorno sobre investimento em 10 anos (%)
- **Viável:** Se payback ≤ 10 anos

### Fórmulas Utilizadas

#### Potência Necessária

```
P_BESS = P_pico × (redução_desejada / 100)
```

#### Capacidade Necessária

```
E_BESS = P_BESS × duracao_ponta × ciclos_dia × 1.2 (margem)
```

#### Economia Anual

```
Economia = (Economia_demanda + Economia_energia) × 12 meses
```

#### Payback

```
Payback = Investimento / Economia_anual
```

---

## 📈 Interpretação de Resultados

### Exemplo 1: Indústria Média - Carregamento Solar

**Dados:**
- Demanda contratada: 400 kW
- Pico de demanda: 450 kW
- Tarifa ponta: R$ 1,71/kWh
- Tarifa fora-ponta: R$ 0,72/kWh
- Cobrança demanda: R$ 50/kW/mês

**Resultado:**
- Potência BESS: 90 kW (20% redução)
- Capacidade BESS: 324 kWh
- Economia anual: R$ 97.088
- Payback: 2,1 anos ✅ **Viável**

**Interpretação:**
- O BESS recupera seu investimento em 2,1 anos
- Após payback, gera economia pura de R$ 97k/ano
- ROI 10 anos: 385% (muito atrativo)

### Exemplo 2: Pequeno Comércio - Carregamento Madrugada

**Dados:**
- Demanda contratada: 30 kW
- Pico de demanda: 35 kW
- Tarifa ponta: R$ 1,71/kWh
- Tarifa fora-ponta: R$ 0,72/kWh
- Cobrança demanda: R$ 50/kW/mês

**Resultado:**
- Potência BESS: 7 kW (20% redução)
- Capacidade BESS: 25 kWh
- Economia anual: R$ 8.500
- Payback: 4,7 anos ⚠️ **Marginal**

**Interpretação:**
- Payback aceitável (< 5 anos)
- Menor escala reduz economia absoluta
- Considerar outros benefícios (confiabilidade, backup)

---

## 💡 Exemplos Práticos

### Cenário 1: Fábrica com Picos de Demanda

**Situação:**
- Fábrica de 300 kW de demanda contratada
- Picos de 450 kW durante ponta (18-21h)
- Multas por ultrapassagem de demanda

**Solução:**
1. Gerar caso de teste: Indústria Média, Grave, 30 dias
2. Configurar tarifas CEMIG Uberaba
3. Dimensionar com 30% redução de demanda
4. Simular com carregamento solar (se houver painéis)
5. Resultado esperado: Payback 1,5-2 anos

### Cenário 2: Comércio com Consumo Regular

**Situação:**
- Loja de 50 kW de demanda contratada
- Consumo previsível e regular
- Sem geração própria

**Solução:**
1. Upload de dados reais (3 meses)
2. Configurar tarifas locais
3. Dimensionar com 15% redução
4. Simular com carregamento madrugada
5. Resultado esperado: Payback 3-4 anos

### Cenário 3: Validação de Investimento

**Situação:**
- Empresa quer validar proposta de fornecedor
- Fornecedor propõe: 100 kW, 250 kWh, R$ 200k

**Solução:**
1. Upload de dados reais (12 meses)
2. Configurar tarifas reais
3. Inserir custo do fornecedor (R$ 200k)
4. Simular ambas estratégias
5. Comparar com dimensionamento da aplicação
6. Validar se proposta é competitiva

---

## 🔧 Dicas e Boas Práticas

### Upload de Dados

- ✅ Use dados de **pelo menos 30 dias** para análise confiável
- ✅ Prefira **dados contínuos** sem falhas
- ✅ Valide formato antes de upload
- ❌ Evite períodos com paradas ou manutenção

### Configuração de Tarifas

- ✅ Consulte **última fatura** de energia
- ✅ Use valores **com impostos inclusos**
- ✅ Atualize **anualmente** com novas tarifas
- ❌ Não use valores aproximados

### Dimensionamento

- ✅ Comece com **redução 20%** como baseline
- ✅ Teste múltiplos cenários (10%, 20%, 30%)
- ✅ Considere **margem de segurança**
- ❌ Não dimensione para 100% de redução

### Simulação

- ✅ Compare **ambas estratégias** (solar vs madrugada)
- ✅ Valide **suposições** com especialista
- ✅ Considere **degradação** de bateria (vida útil)
- ❌ Não ignore custos de manutenção

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [Documentação de Arquitetura](./01-ARQUITETURA.md)
2. Verifique [Tarifas CEMIG](./02-TARIFAS-CEMIG-UBERABA.md)
3. Revise [Schema do Banco de Dados](./02-BANCO-DE-DADOS.md)
4. Consulte [Gerador de Casos](./03-GERADOR-CASOS-TESTE.md)

---

**Versão:** 1.0  
**Data:** Dezembro 2025  
**Desenvolvido com:** React, Python, SQLite, tRPC
