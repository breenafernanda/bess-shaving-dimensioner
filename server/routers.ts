/**
 * MÓDULO: Routers tRPC
 * 
 * Define todos os endpoints da aplicação usando tRPC procedures.
 * Sem autenticação, todos os endpoints são públicos.
 */

import { publicProcedure, router } from "./_core/trpc";
import { bessRouter } from "./routers/bess";

/**
 * Router principal da aplicação
 * 
 * Agrupa todos os procedures em namespaces lógicos.
 * Exemplo de estrutura:
 * - bess.upload
 * - bess.simulate
 * - tariff.list
 * - tariff.create
 */
export const appRouter = router({
  /**
   * Namespace: BESS (Battery Energy Storage System)
   * 
   * Procedures para upload de arquivos e simulações
   */
  bess: bessRouter,

  /**
   * Namespace: Tarifas
   * 
   * Procedures para gerenciar configurações tarifárias
   */
  tariff: router({
    // TODO: Adicionar procedures aqui
    // list: publicProcedure.query(...)
    // create: publicProcedure.input(...).mutation(...)
    // update: publicProcedure.input(...).mutation(...)
    // delete: publicProcedure.input(...).mutation(...)
  }),
});

// Exporta o tipo do router para uso no frontend
export type AppRouter = typeof appRouter;

