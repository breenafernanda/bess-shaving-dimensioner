/**
 * APLICAÇÃO: BESS Peak Shaving Dimensioner
 * 
 * Aplicação web para dimensionamento e análise de viabilidade de sistemas
 * de armazenamento de energia (BESS) voltados para peak shaving.
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import TestCaseGenerator from "./pages/TestCaseGenerator";
import BessAnalysis from "./pages/BessAnalysis";

/**
 * Router principal da aplicação
 * 
 * Define todas as rotas disponíveis
 */
function Router() {
  return (
    <Switch>
      {/* Página inicial */}
      <Route path={"/"} component={Home} />

      {/* Gerador de casos de teste */}
       <Route path={"/test-case-generator"} component={TestCaseGenerator} />

      {/* Análise BESS */}
      <Route path={"/bess-analysis"} component={BessAnalysis} />

      {/* Página 404 */}
      <Route path={"/404"} component={NotFound} />

      {/* Fallback para rotas não encontradas */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Componente raiz da aplicação
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
