/**
 * HOOK: useAuth
 * 
 * Fornece estado de autenticação do usuário.
 * Como não há autenticação, sempre retorna usuário "anônimo".
 */

import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/**
 * Hook para gerenciar estado de autenticação
 * 
 * Sem autenticação OAuth, retorna um usuário anônimo padrão.
 * 
 * @param options - Opções do hook (não utilizadas)
 * @returns Estado de autenticação
 */
export function useAuth(options?: UseAuthOptions) {
  // Usuário anônimo padrão
  const anonymousUser = {
    id: 0,
    name: "Usuário",
    email: null,
  };

  // Função logout (sem-op, pois não há autenticação)
  const logout = useCallback(async () => {
    console.log("[Auth] Logout chamado (sem-op)");
  }, []);

  // Estado de autenticação
  const state = useMemo(() => {
    return {
      user: anonymousUser,
      loading: false,
      error: null,
      isAuthenticated: true, // Sempre autenticado
    };
  }, []);

  return {
    ...state,
    refresh: () => Promise.resolve(),
    logout,
  };
}
