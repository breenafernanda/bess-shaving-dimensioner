# BESS Peak Shaving Dimensioner - TODO

## Backend & Infraestrutura
- [x] Estrutura de banco de dados (schema Drizzle)
  - [x] Tabela de uploads de arquivos
  - [x] Tabela de configurações tarifárias
  - [x] Tabela de simulações e resultados
  - [x] Tabela de histórico de análises
- [x] Parser de Excel para formato Elspec
- [x] Processador de curva de carga (identificação de picos, classificação por horário)
- [x] Algoritmo de dimensionamento de BESS (cálculo de kW e kWh)
- [x] Motor de simulação dia a dia com estratégias de carregamento
- [x] Calculadora de análise financeira (economia, payback, ROI)
- [ ] Integração com OpenDSS para validação técnica (roadmap)
- [x] Endpoints tRPC para todas as funcionalidades

## Frontend - Componentes Principais
- [x] Página de upload de arquivo Excel
- [x] Componente de configuração de tarifas (ponta, intermediária, fora-ponta)
- [x] Visualização de curva de carga original (gráfico interativo)
- [x] Visualização de impacto nos horários (ponta, intermediária)
- [x] Componente de resultado de dimensionamento (kW, kWh)
- [x] Simulador dia a dia com timeline e opções de estratégia
- [x] Gráfico de curva otimizada vs original
- [x] Painel de análise financeira (economia, payback, ROI)
- [ ] Relatório consolidado com exportação (roadmap)
- [ ] Validação técnica do OpenDSS (roadmap)

## Funcionalidades Específicas
- [x] Upload e processamento de arquivo Excel
- [x] Análise automática de picos de demanda
- [x] Identificação de horários de ponta/intermediária/fora-ponta
- [x] Cálculo de potência (kW) necessária para peak shaving
- [x] Cálculo de capacidade (kWh) para ciclo completo
- [x] Simulação com carregamento por geração própria (solar)
- [x] Simulação com carregamento por tarifa baixa (madrugada)
- [x] Cálculo de economia anual (redução de demanda + multas)
- [x] Cálculo de payback period
- [x] Cálculo de ROI
- [ ] Validação com OpenDSS (tensão, corrente, perdas, fator de potência) (roadmap)
- [ ] Geração de relatório visual e exportável (roadmap)

## Design & UX
- [x] Design system elegante (cores, tipografia, espaçamento)
- [x] Layout responsivo (desktop, tablet, mobile)
- [x] Navegação intuitiva entre etapas
- [x] Feedback visual para processamento (loading states)
- [x] Tooltips e ajuda contextual
- [x] Gráficos interativos com Recharts
- [x] Tema visual consistente

## Testes & Qualidade
- [x] Testes unitários para parser de Excel
- [x] Testes para algoritmo de dimensionamento
- [x] Testes para cálculos financeiros
- [ ] Testes de integração com OpenDSS (roadmap)
- [ ] Testes E2E para fluxo completo (roadmap)
- [x] Validação de dados de entrada
- [x] Tratamento de erros e edge cases

## Documentação & Entrega
- [x] Documentação de API (endpoints)
- [x] Guia de uso da aplicação
- [x] Exemplos de entrada e saída
- [x] README com instruções de setup
- [x] Arquivo de configuração de exemplo


## Gerador de Casos de Teste (Nova Funcionalidade)
- [x] Componente React para seleção de parâmetros (tamanho empresa, severidade, dias)
- [x] Gerador de curva de carga industrial em Python
- [x] 5 estágios de empresas com ranges de demanda
- [x] 3 níveis de severidade (leve, moderado, grave)
- [x] Gerador de nomes de empresas aleatórios
- [x] Exportação em formato Excel (Elspec)
- [x] Endpoint tRPC para geração de casos de teste
