/**
 * ROUTER: BESS (Battery Energy Storage System)
 * 
 * Procedures para upload de arquivos, simulações e geração de casos de teste.
 */

import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { spawn } from "child_process";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Schema de validação para geração de caso de teste
 */
const GenerateTestCaseSchema = z.object({
  // Estágio da empresa (1-5)
  stage: z.number().int().min(1).max(5),

  // Nível de severidade
  severity: z.enum(["leve", "moderado", "grave"]),

  // Número de dias
  days: z.number().int().min(1).max(365),
});

type GenerateTestCaseInput = z.infer<typeof GenerateTestCaseSchema>;

/**
 * Executa o gerador Python de casos de teste
 * 
 * @param params - Parâmetros de entrada
 * @returns Resultado da geração
 */
async function executeTestCaseGenerator(
  params: GenerateTestCaseInput
): Promise<any> {
  return new Promise((resolve, reject) => {
    // Caminho do script Python
    const scriptPath = path.join(
      __dirname,
      "../python-workers/gerador_casos_teste.py"
    );

    // Caminho de saída do arquivo
    const outputPath = path.join(
      __dirname,
      `../../uploads/caso_teste_${Date.now()}.xlsx`
    );

    // Argumentos para o script Python
    const args = [
      scriptPath,
      "--stage",
      params.stage.toString(),
      "--severity",
      params.severity,
      "--days",
      params.days.toString(),
      "--output",
      outputPath,
    ];

    // Executar script Python
    const process = spawn("python3", args);

    let stdout = "";
    let stderr = "";

    // Capturar saída padrão
    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // Capturar erros
    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Quando o processo termina
    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Erro ao gerar caso de teste: ${stderr}`));
        return;
      }

      try {
        // Parse do resultado JSON
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (error) {
        reject(new Error(`Erro ao parsear resultado: ${error}`));
      }
    });

    // Erro ao iniciar o processo
    process.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Router BESS com procedures
 */
export const bessRouter = router({
  /**
   * Gera um novo caso de teste
   * 
   * Cria um arquivo Excel realista com curva de carga industrial
   * baseado nos parâmetros fornecidos.
   * 
   * @param stage - Estágio da empresa (1-5)
   * @param severity - Nível de severidade (leve, moderado, grave)
   * @param days - Número de dias a simular (1-365)
   * 
   * @returns Metadados do caso gerado (nome empresa, demanda, etc)
   */
  generateTestCase: publicProcedure
    .input(GenerateTestCaseSchema)
    .mutation(async ({ input }) => {
      try {
        // Executar gerador Python
        const result = await executeTestCaseGenerator(input);

        // Retornar resultado
        return {
          sucesso: true,
          dados: result,
        };
      } catch (erro) {
        console.error("[BESS] Erro ao gerar caso de teste:", erro);

        return {
          sucesso: false,
          erro: erro instanceof Error ? erro.message : "Erro desconhecido",
        };
      }
    }),

  /**
   * Lista todos os uploads realizados
   * 
   * @returns Lista de uploads com metadados
   */
  listUploads: publicProcedure.query(async () => {
    // TODO: Implementar listagem de uploads do banco de dados
    return {
      uploads: [],
    };
  }),

  /**
   * Obtém detalhes de um upload específico
   * 
   * @param uploadId - ID do upload
   * @returns Detalhes do upload
   */
  getUpload: publicProcedure
    .input(z.object({ uploadId: z.number() }))
    .query(async ({ input }) => {
      // TODO: Implementar busca de upload no banco de dados
      return {
        upload: null,
      };
    }),

  /**
   * Realiza simulação de BESS
   * 
   * @param uploadId - ID do upload a simular
   * @param tariffConfigId - ID da configuração tarifária
   * @param bessCapacityKwh - Capacidade do BESS em kWh
   * @param bessPowerKw - Potência do BESS em kW
   * @param chargingStrategy - Estratégia de carregamento (solar ou grid-offpeak)
   * 
   * @returns Resultados da simulação
   */
  simulate: publicProcedure
    .input(
      z.object({
        uploadId: z.number(),
        tariffConfigId: z.number(),
        bessCapacityKwh: z.number().positive(),
        bessPowerKw: z.number().positive(),
        chargingStrategy: z.enum(["solar", "grid-offpeak"]),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Implementar simulação de BESS
      return {
        sucesso: false,
        erro: "Simulação ainda não implementada",
      };
    }),
});
