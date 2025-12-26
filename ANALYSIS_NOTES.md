# Análise do Arquivo de Referência

## Arquivo: CópiadeCeramica_Arte_Tempo.xlsm

### Estrutura Observada
- **Sheet:** "Data"
- **Colunas:** 
  - Coluna A: "Time stamp" (timestamps em formato DD/MM/YYYY HH:MM:SS.000000)
  - Coluna B: "[kW] Active Power Total (Cycle) Average, Ceramica Arte Tempo - WYE" (valores de potência ativa em kW)

### Dados
- **Período:** 07/08/2025 16:00 até 19/08/2025 15:00
- **Total de linhas:** 288 (1 header + 287 dados)
- **Intervalo:** Horário (1 hora entre cada medição)
- **Duração:** ~12 dias de dados

### Observação Importante
⚠️ **Os valores de potência ativa estão vazios (None/NaN)** no arquivo fornecido. Este é um arquivo de template/referência que mostra apenas a estrutura esperada.

### Formato Esperado para Entrada
A aplicação deve aceitar arquivos Excel com:
1. Uma coluna de timestamps (formato: DD/MM/YYYY HH:MM:SS.000000)
2. Uma ou mais colunas de potência ativa (kW) com valores numéricos
3. Intervalo de medição: horário (1 hora)
4. Período de análise: mínimo 1 dia, sem limite máximo

### Próximos Passos
- Criar parser robusto para ler este formato
- Permitir upload de arquivos com dados reais
- Gerar dados de exemplo para testes
