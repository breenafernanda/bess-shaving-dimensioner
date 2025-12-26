import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * TABELA: Configurações Tarifárias
 * 
 * Armazena as estruturas de preços de energia definidas pelo usuário.
 * Cada configuração tarifária especifica os horários de ponta, intermediária
 * e fora-ponta, com seus respectivos preços em R$/kWh.
 */
export const tariffConfigs = sqliteTable("tariffConfigs", {
  // Identificador único da configuração tarifária
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Nome descritivo da tarifa (ex: "Tarifa CPFL 2025")
  name: text("name").notNull(),
  
  // Hora de início do horário de ponta (0-23)
  peakStartHour: integer("peakStartHour").notNull(),
  
  // Hora de término do horário de ponta (0-23)
  peakEndHour: integer("peakEndHour").notNull(),
  
  // Hora de início do horário intermediário (opcional, 0-23)
  intermediateStartHour: integer("intermediateStartHour"),
  
  // Hora de término do horário intermediário (opcional, 0-23)
  intermediateEndHour: integer("intermediateEndHour"),
  
  // Preço da energia no horário de ponta (R$/kWh)
  peakPricePerKwh: real("peakPricePerKwh").notNull(),
  
  // Preço da energia no horário intermediário (R$/kWh, opcional)
  intermediatePricePerKwh: real("intermediatePricePerKwh"),
  
  // Preço da energia fora de ponta (R$/kWh)
  offPeakPricePerKwh: real("offPeakPricePerKwh").notNull(),
  
  // Cobrança de demanda (R$/kW/mês)
  demandChargePerKw: real("demandChargePerKw").notNull(),
  
  // Multa por ultrapassagem de demanda (percentual)
  peakDemandPenaltyPercent: real("peakDemandPenaltyPercent").default(20),
  
  // Data de criação
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  
  // Data da última atualização
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type TariffConfig = typeof tariffConfigs.$inferSelect;
export type InsertTariffConfig = typeof tariffConfigs.$inferInsert;

/**
 * TABELA: Uploads de Arquivos
 * 
 * Registra cada arquivo Excel enviado pelo usuário, armazenando
 * informações sobre o período analisado e estatísticas básicas
 * de consumo extraídas do arquivo.
 */
export const uploads = sqliteTable("uploads", {
  // Identificador único do upload
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Nome original do arquivo enviado
  fileName: text("fileName").notNull(),
  
  // Caminho local onde o arquivo foi armazenado
  filePath: text("filePath").notNull(),
  
  // Data de início dos dados no arquivo
  startDate: integer("startDate", { mode: "timestamp" }).notNull(),
  
  // Data de término dos dados no arquivo
  endDate: integer("endDate", { mode: "timestamp" }).notNull(),
  
  // Quantidade total de dias analisados
  totalDays: integer("totalDays").notNull(),
  
  // Quantidade total de pontos de dados (horas)
  dataPoints: integer("dataPoints").notNull(),
  
  // Demanda máxima encontrada no período (kW)
  peakDemandKw: real("peakDemandKw").notNull(),
  
  // Demanda média durante o período (kW)
  averageDemandKw: real("averageDemandKw").notNull(),
  
  // Demanda mínima encontrada no período (kW)
  minDemandKw: real("minDemandKw").notNull(),
  
  // Data de criação do registro
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  
  // Data da última atualização
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = typeof uploads.$inferInsert;

/**
 * TABELA: Dados de Perfil de Carga
 * 
 * Armazena cada ponto de medição do arquivo Excel enviado.
 * Cada linha representa uma medição horária com timestamp e potência.
 */
export const loadProfileData = sqliteTable("loadProfileData", {
  // Identificador único do ponto de dados
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Referência ao upload de origem
  uploadId: integer("uploadId").notNull(),
  
  // Índice sequencial do ponto (0, 1, 2, ...)
  hourIndex: integer("hourIndex").notNull(),
  
  // Timestamp exato da medição
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
  
  // Potência ativa medida em kW
  powerKw: real("powerKw").notNull(),
  
  // Hora do dia (0-23)
  hourOfDay: integer("hourOfDay").notNull(),
  
  // Dia da semana (0=domingo, 6=sábado)
  dayOfWeek: integer("dayOfWeek").notNull(),
  
  // Data de criação do registro
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type LoadProfileData = typeof loadProfileData.$inferSelect;
export type InsertLoadProfileData = typeof loadProfileData.$inferInsert;

/**
 * TABELA: Simulações
 * 
 * Armazena cada simulação de BESS realizada pelo usuário,
 * incluindo parâmetros de entrada e resultados de saída.
 */
export const simulations = sqliteTable("simulations", {
  // Identificador único da simulação
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Referência ao upload utilizado
  uploadId: integer("uploadId").notNull(),
  
  // Referência à configuração tarifária utilizada
  tariffConfigId: integer("tariffConfigId").notNull(),
  
  // Nome descritivo da simulação
  name: text("name").notNull(),
  
  // Descrição detalhada (opcional)
  description: text("description"),
  
  // Capacidade do BESS dimensionado (kWh)
  bessCapacityKwh: real("bessCapacityKwh").notNull(),
  
  // Potência do BESS dimensionado (kW)
  bessPowerKw: real("bessPowerKw").notNull(),
  
  // Estratégia de carregamento: 'solar' ou 'grid-offpeak'
  chargingStrategy: text("chargingStrategy", {
    enum: ["solar", "grid-offpeak"],
  }).notNull(),
  
  // Demanda máxima desejada após instalação do BESS (kW)
  targetDemandKw: real("targetDemandKw").notNull(),
  
  // Economia financeira anual estimada (R$)
  annualSavingsReais: real("annualSavingsReais"),
  
  // Tempo de retorno do investimento (anos)
  paybackYears: real("paybackYears"),
  
  // Retorno sobre investimento (percentual)
  roiPercent: real("roiPercent"),
  
  // Custo de investimento inicial do BESS (R$)
  bessInvestmentCost: real("bessInvestmentCost"),
  
  // Status da simulação: 'pending', 'processing', 'completed', 'failed'
  status: text("status", {
    enum: ["pending", "processing", "completed", "failed"],
  })
    .default("pending")
    .notNull(),
  
  // Mensagem de erro (preenchida se status = 'failed')
  errorMessage: text("errorMessage"),
  
  // Resultados detalhados em formato JSON
  resultsJson: text("resultsJson"),
  
  // Data de criação
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  
  // Data da última atualização
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = typeof simulations.$inferInsert;

/**
 * TABELA: Resultados de Simulação Diária
 * 
 * Armazena os resultados dia a dia da simulação, incluindo
 * economia, estado de carga do BESS e outros indicadores.
 */
export const dailySimulationResults = sqliteTable("dailySimulationResults", {
  // Identificador único
  id: integer("id").primaryKey({ autoIncrement: true }),
  
  // Referência à simulação
  simulationId: integer("simulationId").notNull(),
  
  // Índice do dia (0, 1, 2, ...)
  dayIndex: integer("dayIndex").notNull(),
  
  // Data do dia simulado
  date: integer("date", { mode: "timestamp" }).notNull(),
  
  // Demanda máxima original sem BESS (kW)
  peakDemandOriginalKw: real("peakDemandOriginalKw").notNull(),
  
  // Demanda máxima com BESS (kW)
  peakDemandWithBessKw: real("peakDemandWithBessKw").notNull(),
  
  // Redução de demanda alcançada (kW)
  demandReductionKw: real("demandReductionKw").notNull(),
  
  // Energia carregada no BESS durante o dia (kWh)
  energyChargedKwh: real("energyChargedKwh").notNull(),
  
  // Energia descarregada do BESS durante o dia (kWh)
  energyDischargedKwh: real("energyDischargedKwh").notNull(),
  
  // Custo de carregamento do BESS (R$)
  chargingCostReais: real("chargingCostReais").notNull(),
  
  // Economia obtida pela descarga do BESS (R$)
  dischargingSavingsReais: real("dischargingSavingsReais").notNull(),
  
  // Economia líquida do dia (R$)
  netDailySavingsReais: real("netDailySavingsReais").notNull(),
  
  // Estado de carga final do BESS (percentual 0-100)
  bessStateOfChargePercent: real("bessStateOfChargePercent").notNull(),
  
  // Data de criação
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type DailySimulationResult = typeof dailySimulationResults.$inferSelect;
export type InsertDailySimulationResult =
  typeof dailySimulationResults.$inferInsert;
