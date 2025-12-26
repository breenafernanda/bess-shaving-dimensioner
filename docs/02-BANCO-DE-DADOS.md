# Banco de Dados - Schema e Modelos

## Visão Geral

O banco de dados SQLite armazena todas as configurações, uploads e resultados de simulações. O schema é definido em TypeScript usando Drizzle ORM, permitindo type-safety completo.

## Tabelas

### 1. `tariffConfigs` - Configurações Tarifárias

Armazena as estruturas de preços de energia definidas pelo usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária, auto-incremento |
| `name` | TEXT | Nome da configuração (ex: "CEMIG Uberaba 2025") |
| `peakStartHour` | INTEGER | Hora de início da ponta (0-23) |
| `peakEndHour` | INTEGER | Hora de término da ponta (0-23) |
| `intermediateStartHour` | INTEGER | Hora de início intermediária (opcional) |
| `intermediateEndHour` | INTEGER | Hora de término intermediária (opcional) |
| `peakPricePerKwh` | REAL | Preço na ponta (R$/kWh) |
| `intermediatePricePerKwh` | REAL | Preço intermediário (R$/kWh, opcional) |
| `offPeakPricePerKwh` | REAL | Preço fora de ponta (R$/kWh) |
| `demandChargePerKw` | REAL | Cobrança de demanda (R$/kW/mês) |
| `peakDemandPenaltyPercent` | REAL | Multa por ultrapassagem (%) |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |

**Exemplo:**
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

### 2. `uploads` - Arquivos Enviados

Registra cada arquivo Excel enviado pelo usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária, auto-incremento |
| `fileName` | TEXT | Nome original do arquivo |
| `filePath` | TEXT | Caminho local do arquivo armazenado |
| `startDate` | TIMESTAMP | Data de início dos dados |
| `endDate` | TIMESTAMP | Data de término dos dados |
| `totalDays` | INTEGER | Quantidade de dias analisados |
| `dataPoints` | INTEGER | Total de pontos (horas) |
| `peakDemandKw` | REAL | Demanda máxima (kW) |
| `averageDemandKw` | REAL | Demanda média (kW) |
| `minDemandKw` | REAL | Demanda mínima (kW) |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```json
{
  "fileName": "CópiadeCeramica_Arte_Tempo.xlsm",
  "filePath": "/uploads/ceramica_20250101.xlsm",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-31T23:00:00Z",
  "totalDays": 31,
  "dataPoints": 744,
  "peakDemandKw": 450.5,
  "averageDemandKw": 250.3,
  "minDemandKw": 120.1
}
```

### 3. `loadProfileData` - Dados de Carga Horária

Armazena cada ponto de medição do arquivo Excel.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária, auto-incremento |
| `uploadId` | INTEGER | Referência ao upload |
| `hourIndex` | INTEGER | Índice sequencial (0, 1, 2, ...) |
| `timestamp` | TIMESTAMP | Momento exato da medição |
| `powerKw` | REAL | Potência ativa (kW) |
| `hourOfDay` | INTEGER | Hora do dia (0-23) |
| `dayOfWeek` | INTEGER | Dia da semana (0=dom, 6=sab) |
| `createdAt` | TIMESTAMP | Data de criação |

**Exemplo:**
```json
{
  "uploadId": 1,
  "hourIndex": 0,
  "timestamp": "2025-01-01T00:00:00Z",
  "powerKw": 250.5,
  "hourOfDay": 0,
  "dayOfWeek": 2
}
```

### 4. `simulations` - Simulações de BESS

Armazena cada simulação realizada pelo usuário.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária, auto-incremento |
| `uploadId` | INTEGER | Referência ao upload utilizado |
| `tariffConfigId` | INTEGER | Referência à tarifa utilizada |
| `name` | TEXT | Nome descritivo da simulação |
| `description` | TEXT | Descrição detalhada (opcional) |
| `bessCapacityKwh` | REAL | Capacidade do BESS (kWh) |
| `bessPowerKw` | REAL | Potência do BESS (kW) |
| `chargingStrategy` | TEXT | Estratégia: 'solar' ou 'grid-offpeak' |
| `targetDemandKw` | REAL | Demanda máxima desejada (kW) |
| `annualSavingsReais` | REAL | Economia anual (R$) |
| `paybackYears` | REAL | Tempo de retorno (anos) |
| `roiPercent` | REAL | Retorno sobre investimento (%) |
| `bessInvestmentCost` | REAL | Custo do BESS (R$) |
| `status` | TEXT | 'pending', 'processing', 'completed', 'failed' |
| `errorMessage` | TEXT | Mensagem de erro (se falhar) |
| `resultsJson` | TEXT | Resultados detalhados em JSON |
| `createdAt` | TIMESTAMP | Data de criação |
| `updatedAt` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```json
{
  "uploadId": 1,
  "tariffConfigId": 1,
  "name": "Simulação 1 - Solar",
  "description": "Carregamento com geração solar",
  "bessCapacityKwh": 500,
  "bessPowerKw": 200,
  "chargingStrategy": "solar",
  "targetDemandKw": 300,
  "annualSavingsReais": 45000,
  "paybackYears": 4.5,
  "roiPercent": 22.2,
  "bessInvestmentCost": 200000,
  "status": "completed"
}
```

### 5. `dailySimulationResults` - Resultados Diários

Armazena os resultados dia a dia de cada simulação.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Chave primária, auto-incremento |
| `simulationId` | INTEGER | Referência à simulação |
| `dayIndex` | INTEGER | Índice do dia (0, 1, 2, ...) |
| `date` | TIMESTAMP | Data do dia simulado |
| `peakDemandOriginalKw` | REAL | Demanda máxima original (kW) |
| `peakDemandWithBessKw` | REAL | Demanda máxima com BESS (kW) |
| `demandReductionKw` | REAL | Redução alcançada (kW) |
| `energyChargedKwh` | REAL | Energia carregada (kWh) |
| `energyDischargedKwh` | REAL | Energia descarregada (kWh) |
| `chargingCostReais` | REAL | Custo de carregamento (R$) |
| `dischargingSavingsReais` | REAL | Economia de descarga (R$) |
| `netDailySavingsReais` | REAL | Economia líquida (R$) |
| `bessStateOfChargePercent` | REAL | Estado de carga final (%) |
| `createdAt` | TIMESTAMP | Data de criação |

**Exemplo:**
```json
{
  "simulationId": 1,
  "dayIndex": 0,
  "date": "2025-01-01T00:00:00Z",
  "peakDemandOriginalKw": 450,
  "peakDemandWithBessKw": 300,
  "demandReductionKw": 150,
  "energyChargedKwh": 400,
  "energyDischargedKwh": 380,
  "chargingCostReais": 287.66,
  "dischargingSavingsReais": 651.41,
  "netDailySavingsReais": 363.75,
  "bessStateOfChargePercent": 95
}
```

## Relacionamentos

```
tariffConfigs (1) ──────────────────────── (N) simulations
                                                    │
                                                    │
uploads (1) ─────────────────────────────── (N) simulations
     │                                             │
     │                                             │
     └──────── (1) ──────────────── (N) dailySimulationResults
                    loadProfileData
```

## Operações Comuns

### Criar uma nova tarifa
```typescript
const tariff = await db.insert(tariffConfigs).values({
  name: "CEMIG Uberaba 2025",
  peakStartHour: 18,
  peakEndHour: 21,
  // ... outros campos
});
```

### Recuperar dados de um upload
```typescript
const upload = await db.select().from(uploads).where(eq(uploads.id, 1));
const loadData = await db.select().from(loadProfileData).where(eq(loadProfileData.uploadId, 1));
```

### Salvar resultados de simulação
```typescript
await db.insert(simulations).values({
  uploadId: 1,
  tariffConfigId: 1,
  // ... outros campos
});

await db.insert(dailySimulationResults).values(dailyResults);
```

## Índices Recomendados

Para melhor performance, considere adicionar índices:

```sql
CREATE INDEX idx_loadProfileData_uploadId ON loadProfileData(uploadId);
CREATE INDEX idx_simulations_uploadId ON simulations(uploadId);
CREATE INDEX idx_simulations_tariffConfigId ON simulations(tariffConfigId);
CREATE INDEX idx_dailySimulationResults_simulationId ON dailySimulationResults(simulationId);
```

## Backup e Recuperação

O arquivo `bess.db` contém todo o banco de dados. Para backup:

```bash
cp bess.db bess.db.backup
```

Para restaurar:

```bash
cp bess.db.backup bess.db
```
