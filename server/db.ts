/**
 * MÓDULO: Banco de Dados
 * 
 * Gerencia a conexão com o banco de dados SQLite e fornece
 * funções auxiliares para operações comuns.
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// Instância global do banco de dados
let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Obtém a instância do banco de dados.
 * 
 * Se ainda não foi inicializada, cria uma nova conexão SQLite.
 * O caminho padrão é "bess.db" no diretório raiz do projeto.
 * 
 * @returns {Promise<ReturnType<typeof drizzle> | null>} Instância do banco ou null se falhar
 */
export async function getDb() {
  // Se já existe uma instância, retorna ela
  if (_db) {
    return _db;
  }

  try {
    // Define o caminho do banco de dados
    // Pode ser sobrescrito pela variável de ambiente DATABASE_URL
    const dbPath = process.env.DATABASE_URL || "bess.db";
    
    // Cria conexão SQLite
    const sqlite = new Database(dbPath);
    
    // Inicializa Drizzle ORM com a conexão
    _db = drizzle(sqlite);
    
    console.log(`[Database] Conectado com sucesso: ${dbPath}`);
    return _db;
  } catch (erro) {
    console.error("[Database] Erro ao conectar:", erro);
    return null;
  }
}

/**
 * Verifica se o banco de dados está disponível.
 * 
 * @returns {Promise<boolean>} true se banco está disponível, false caso contrário
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  const db = await getDb();
  return db !== null;
}

// TODO: Adicionar funções de query específicas do domínio conforme necessário
// Exemplos:
// - getTariffConfig(id)
// - saveTariffConfig(config)
// - getUpload(id)
// - saveSimulation(simulation)
// - getDailyResults(simulationId)
