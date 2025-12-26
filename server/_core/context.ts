/**
 * MÓDULO: Contexto tRPC
 * 
 * Define o contexto que é passado para cada chamada de procedure tRPC.
 * Sem autenticação, o contexto é simples e apenas contém req e res.
 */

import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Tipo do contexto tRPC
 * 
 * Contém apenas os objetos de requisição e resposta Express.
 * Sem autenticação, não há informações de usuário.
 */
export type TrpcContext = {
  // Objeto de requisição HTTP Express
  req: CreateExpressContextOptions["req"];
  
  // Objeto de resposta HTTP Express
  res: CreateExpressContextOptions["res"];
};

/**
 * Cria o contexto para uma chamada tRPC
 * 
 * @param opts - Opções do Express (req, res)
 * @returns Contexto tRPC com req e res
 */
export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  return {
    req: opts.req,
    res: opts.res,
  };
}
