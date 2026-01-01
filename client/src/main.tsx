// FastAPI: integração via REST/axios/fetch
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { getLoginUrl } from "./const";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

function redirectToLoginIfUnauthorized(error: any) {
  if (typeof window === "undefined") return;
  if (error?.message === UNAUTHED_ERR_MSG) {
    window.location.href = getLoginUrl();
  }
}

// Exemplo de listener para erros globais de queries
queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);