# Gerador de Casos de Teste

## Visão Geral

O gerador de casos de teste permite criar arquivos Excel realistas com curvas de carga industriais para simular diferentes cenários de empresas. Útil para testes, demonstrações e análises comparativas.

## Estágios de Empresas

O sistema oferece 5 estágios de empresas com ranges de demanda contratada:

| Estágio | Descrição | Range de Demanda (kW) | Exemplo |
|---------|-----------|----------------------|---------|
| **1** | Pequeno Comércio | 10 - 50 | Padaria, Loja de roupas |
| **2** | Pequena Indústria | 50 - 150 | Oficina mecânica, Fábrica pequena |
| **3** | Indústria Média | 150 - 500 | Fábrica de médio porte |
| **4** | Indústria Grande | 500 - 1.500 | Fábrica grande, Distribuição |
| **5** | Indústria Pesada | 1.500 - 5.000 | Siderurgia, Petroquímica |

## Níveis de Severidade

Cada caso de teste pode ter 3 níveis de severidade que afetam a variabilidade da curva:

### Leve (Consumo Regular)
- **Variação:** ±5% da demanda contratada
- **Picos:** Ocasionais, até 10% acima da demanda contratada
- **Uso:** Empresas com consumo estável e previsível
- **Impacto BESS:** Baixo - poucas oportunidades de economia

### Moderado (Consumo Variável)
- **Variação:** ±15% da demanda contratada
- **Picos:** Frequentes, até 25% acima da demanda contratada
- **Uso:** Empresas com consumo oscilante
- **Impacto BESS:** Médio - oportunidades moderadas de economia

### Grave (Consumo Muito Variável)
- **Variação:** ±30% da demanda contratada
- **Picos:** Muito frequentes, até 50% acima da demanda contratada
- **Uso:** Empresas com picos de consumo significativos
- **Impacto BESS:** Alto - grande potencial de economia

## Curva de Carga Padrão Industrial

A curva de carga segue um padrão típico de indústrias brasileiras:

```
Potência (pu)
    1.0 |                    ╱─────╲
        |                   ╱       ╲
    0.8 |        ╱─────────╱         ╲───╲
        |       ╱                         ╲
    0.6 |──────╱                           ╲──
        |
    0.4 |
        |
    0.2 |
        |
      0 └─────────────────────────────────────
        0   6   12   18   24 (horas)
```

### Horários Característicos

| Período | Hora | Descrição | Consumo (pu) |
|---------|------|-----------|--------------|
| **Madrugada** | 00-06 | Consumo mínimo | 0.3 - 0.4 |
| **Manhã** | 06-12 | Subida gradual até pico | 0.6 - 0.9 |
| **Almoço** | 12-13 | Pequena queda | 0.7 - 0.8 |
| **Tarde** | 13-18 | Recuperação até pico | 0.8 - 1.0 |
| **Ponta** | 18-22 | Pico máximo | 0.95 - 1.0 |
| **Noite** | 22-24 | Queda para madrugada | 0.4 - 0.6 |

## Geração de Casos de Teste

### Parâmetros de Entrada

```typescript
interface TestCaseParams {
  // Estágio da empresa (1-5)
  companyStage: 1 | 2 | 3 | 4 | 5;
  
  // Nível de severidade
  severity: "leve" | "moderado" | "grave";
  
  // Número de dias a simular
  days: number; // 7, 14, 30, 60, 90
  
  // Data de início (opcional, padrão: hoje)
  startDate?: Date;
}
```

### Saída

Arquivo Excel no formato Elspec com:
- **Coluna A:** Timestamps (DD/MM/YYYY HH:MM:SS.000000)
- **Coluna B:** Potência ativa em kW
- **Nome da empresa:** Gerado aleatoriamente
- **Período:** Conforme solicitado

### Exemplo de Saída

```
Time stamp                          | [kW] Active Power Total (Cycle) Average, Empresa XYZ - WYE
01/01/2025 00:00:00.000000         | 120.5
01/01/2025 01:00:00.000000         | 115.3
01/01/2025 02:00:00.000000         | 110.2
...
01/01/2025 18:00:00.000000         | 450.0
01/01/2025 19:00:00.000000         | 480.5
01/01/2025 20:00:00.000000         | 490.2
...
```

## Algoritmo de Geração

### 1. Seleção de Demanda Contratada

```python
def select_contracted_demand(stage: int) -> float:
    ranges = {
        1: (10, 50),
        2: (50, 150),
        3: (150, 500),
        4: (500, 1500),
        5: (1500, 5000)
    }
    min_kw, max_kw = ranges[stage]
    return random.uniform(min_kw, max_kw)
```

### 2. Geração de Curva Base (em pu)

```python
def generate_base_curve(hour: int) -> float:
    """Retorna valor normalizado (0-1) para cada hora do dia"""
    if 0 <= hour < 6:      # Madrugada
        return 0.35
    elif 6 <= hour < 12:   # Manhã
        return 0.35 + (hour - 6) * 0.08  # Sobe gradualmente
    elif 12 <= hour < 13:  # Almoço
        return 0.83 - 0.1   # Queda
    elif 13 <= hour < 18:  # Tarde
        return 0.73 + (hour - 13) * 0.05  # Recuperação
    elif 18 <= hour < 22:  # Ponta
        return 0.98
    else:                   # Noite
        return 0.98 - (hour - 22) * 0.15  # Queda
```

### 3. Aplicação de Variabilidade

```python
def apply_variability(base_value: float, severity: str) -> float:
    """Adiciona ruído conforme severidade"""
    variation_ranges = {
        "leve": (-0.05, 0.05),
        "moderado": (-0.15, 0.15),
        "grave": (-0.30, 0.30)
    }
    min_var, max_var = variation_ranges[severity]
    noise = random.uniform(min_var, max_var)
    return max(0.1, base_value + noise)  # Mínimo 10% da demanda
```

### 4. Conversão para kW

```python
def convert_to_kw(pu_value: float, contracted_demand: float) -> float:
    """Converte valor normalizado para kW"""
    return pu_value * contracted_demand
```

## Nomes de Empresas Aleatórios

O sistema gera nomes realistas combinando:

**Prefixos industriais:** Metalúrgica, Indústria, Fábrica, Manufatura, Processadora...

**Nomes:** Silva, Santos, Oliveira, Costa, Ferreira, Gomes, Martins...

**Sufixos:** LTDA, S.A., Ind., Manufatureira, Processadora...

**Exemplos gerados:**
- Metalúrgica Silva LTDA
- Indústria Santos S.A.
- Fábrica de Processamento Oliveira
- Manufatura Costa Ind.

## Uso na Aplicação

### Frontend (React)

```tsx
// Componente TestCaseGenerator
<TestCaseGenerator
  onGenerate={(file) => {
    // Fazer upload do arquivo
    uploadFile(file);
  }}
/>
```

### Backend (tRPC)

```typescript
// Endpoint para gerar caso de teste
bess.generateTestCase: publicProcedure
  .input(TestCaseParamsSchema)
  .mutation(async ({ input }) => {
    // Gerar arquivo Excel
    const file = await generateTestCaseFile(input);
    return { fileUrl, fileName };
  })
```

## Validação

Antes de gerar o arquivo, validar:

- ✅ Estágio válido (1-5)
- ✅ Severidade válida (leve, moderado, grave)
- ✅ Dias válido (1-365)
- ✅ Demanda contratada dentro do range
- ✅ Data de início no passado ou hoje

## Performance

- Geração de 30 dias: ~500ms
- Geração de 90 dias: ~1.5s
- Geração de 365 dias: ~5s

## Próximas Melhorias

- [ ] Adicionar variações por dia da semana (fim de semana com consumo menor)
- [ ] Adicionar efeito de sazonalidade (verão vs inverno)
- [ ] Permitir upload de curva personalizada
- [ ] Gerar múltiplos casos de teste em lote
- [ ] Adicionar análise estatística do caso gerado
