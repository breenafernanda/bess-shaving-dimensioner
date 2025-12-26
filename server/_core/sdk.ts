/**
 * MÓDULO: SDK Simplificado
 * 
 * Fornece utilitários gerais para a aplicação.
 * Sem autenticação OAuth, este módulo é minimalista.
 */

/**
 * Classe SDK principal
 * 
 * Contém métodos utilitários para a aplicação.
 */
class SDKServer {
  constructor() {
    console.log("[SDK] Inicializado (sem autenticação)");
  }

  /**
   * Verifica se a aplicação está em desenvolvimento
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  /**
   * Verifica se a aplicação está em produção
   */
  isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  /**
   * Log com prefixo [SDK]
   */
  log(message: string, data?: unknown): void {
    if (data) {
      console.log(`[SDK] ${message}`, data);
    } else {
      console.log(`[SDK] ${message}`);
    }
  }

  /**
   * Log de erro com prefixo [SDK]
   */
  error(message: string, error?: unknown): void {
    if (error) {
      console.error(`[SDK] ${message}`, error);
    } else {
      console.error(`[SDK] ${message}`);
    }
  }
}

// Instância global do SDK
export const sdk = new SDKServer();
