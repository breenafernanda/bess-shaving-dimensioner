/**
 * MÓDULO: tRPC Setup
 * 
 * Configura o tRPC para comunicação type-safe entre frontend e backend.
 * Sem autenticação, todos os procedures são públicos.
 */

import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

/**
 * Inicializa tRPC com o contexto e transformer
 * 
 * - Contexto: TrpcContext (req, res)
 * - Transformer: SuperJSON para serializar tipos complexos (Date, Map, etc)
 */
const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

/**
 * Router para definir procedures
 */
export const router = t.router;

/**
 * Procedure pública - sem autenticação necessária
 * 
 * Todos os procedures são públicos nesta aplicação.
 * Use este para todas as operações.
 */
export const publicProcedure = t.procedure;

// Aliases para compatibilidade (todos são públicos)
export const protectedProcedure = t.procedure;
export const adminProcedure = t.procedure;
