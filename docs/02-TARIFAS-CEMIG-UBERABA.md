# Tarifas CEMIG - Uberaba, MG

## Vigência
**De:** 28 de maio de 2025  
**Até:** 27 de maio de 2026  
**Reajuste:** 7,36% (Resolução Homologatória ANEEL nº 3.459/2025)

## Horários de Ponta e Intermediária

### Horário de Ponta (HP)
- **Período:** 18h00 até 21h00 (3 horas)
- **Dias:** Segunda a sexta-feira (dias úteis)
- **Observação:** Não inclui feriados federais

### Horário Intermediário (HI)
- **Período:** 17h00 até 18h00 e 21h00 até 22h00 (2 horas)
- **Dias:** Segunda a sexta-feira (dias úteis)

### Horário Fora de Ponta (HFP)
- **Período:** 22h00 até 17h00 (9 horas)
- **Dias:** Segunda a sexta-feira + sábados, domingos e feriados (24 horas)

## Tarifas - Grupo B3 (Demais Classes - Tarifa Branca)

Esta é a tarifa mais comum para pequenas e médias empresas em Uberaba.

### Com Bandeira Verde (Condição Normal)

| Período | Preço (R$/kWh) |
|---------|----------------|
| **Horário de Ponta** | 1,71076 |
| **Horário Intermediário** | 1,12539 |
| **Horário Fora de Ponta** | 0,71916 |

### Com Bandeira Amarela (Geração em condições menos favoráveis)

| Período | Preço (R$/kWh) |
|---------|----------------|
| **Horário de Ponta** | 1,72961 |
| **Horário Intermediário** | 1,14424 |
| **Horário Fora de Ponta** | 0,73801 |

### Com Bandeira Vermelha 1 (Geração crítica)

| Período | Preço (R$/kWh) |
|---------|----------------|
| **Horário de Ponta** | 1,75539 |
| **Horário Intermediário** | 1,17002 |
| **Horário Fora de Ponta** | 0,76379 |

### Com Bandeira Vermelha 2 (Geração muito crítica)

| Período | Preço (R$/kWh) |
|---------|----------------|
| **Horário de Ponta** | 1,78953 |
| **Horário Intermediário** | 1,20416 |
| **Horário Fora de Ponta** | 0,79793 |

## Cobrança de Demanda

### Demanda Contratada
A demanda contratada é a potência máxima que a concessionária se compromete a fornecer. É cobrada mensalmente independentemente de ser utilizada.

**Valor:** Definido em contrato individual com a CEMIG

### Multa por Ultrapassagem de Demanda
Quando o consumidor ultrapassa a demanda contratada, sofre uma multa:

**Multa:** 20% do valor da demanda contratada (para cada kW ultrapassado)

## Padrão Recomendado para Aplicação

Para fins de cálculo e simulação na aplicação BESS Peak Shaving Dimensioner, recomenda-se usar:

### Configuração Padrão CEMIG Uberaba

```json
{
  "name": "CEMIG Uberaba - Tarifa Branca B3",
  "peakStartHour": 18,
  "peakEndHour": 21,
  "intermediateStartHour": 17,
  "intermediateEndHour": 22,
  "peakPricePerKwh": 1.71076,
  "intermediatePricePerKwh": 1.12539,
  "offPeakPricePerKwh": 0.71916,
  "demandChargePerKw": 0,
  "peakDemandPenaltyPercent": 20
}
```

**Notas:**
- `demandChargePerKw`: Deixado em 0 pois varia por contrato. Usuário pode ajustar conforme seu contrato.
- `peakDemandPenaltyPercent`: Fixo em 20% conforme regulamentação CEMIG.
- Preços com **Bandeira Verde** (cenário mais favorável).
- Todos os preços **antes de impostos** (ICMS, PIS, COFINS).

## Impacto dos Impostos

Os preços acima são **antes de impostos**. O valor final na fatura inclui:

- **ICMS** (Imposto sobre Circulação de Mercadorias e Serviços): ~18-20% em MG
- **PIS** (Programa de Integração Social): ~7,6%
- **COFINS** (Contribuição para Financiamento da Seguridade Social): ~7,6%

**Exemplo:** Um kWh de R$ 1,71 em horário de ponta pode custar ~R$ 2,30 na fatura final.

## Custo de Disponibilidade

Para unidades consumidoras trifásicas (padrão para empresas):

**Custo mínimo mensal:** 100 kWh (equivalente a ~R$ 71,92 em horário fora de ponta)

Isso significa que mesmo que o consumo seja zero, há uma cobrança mínima equivalente a 100 kWh.

## Referências

- **Fonte Oficial:** https://www.cemig.com.br/atendimento/valores-de-tarifas-e-servicos/
- **Resolução ANEEL:** Homologatória nº 3.459/2025
- **Vigência:** 28/05/2025 a 27/05/2026

## Próximas Atualizações

As tarifas são reajustadas anualmente em maio. Consulte o site da CEMIG para atualizações futuras.
