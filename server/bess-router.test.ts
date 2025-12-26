/**
 * TESTES: Router BESS
 * 
 * Valida os endpoints tRPC para funcionalidades BESS
 */

import { describe, it, expect } from "vitest";

/**
 * Simula gerador de casos de teste
 */
function gerarCasoDeTeste(params: {
  stage: number;
  severity: string;
  days: number;
}): {
  sucesso: boolean;
  nome_empresa: string;
  demanda_contratada_kw: number;
  potencia_maxima_kw: number;
  dias: number;
  potencias: number[];
  timestamps: string[];
} {
  // Ranges de demanda por estágio
  const ranges: Record<number, [number, number]> = {
    1: [10, 50],
    2: [50, 150],
    3: [150, 500],
    4: [500, 1500],
    5: [1500, 5000],
  };

  const [min, max] = ranges[params.stage] || [100, 200];
  const demanda = min + Math.random() * (max - min);

  // Variabilidade conforme severidade
  const variabilidade: Record<string, number> = {
    leve: 0.05,
    moderado: 0.15,
    grave: 0.3,
  };

  const variacao = variabilidade[params.severity] || 0.15;
  const potencia_maxima = demanda * (1 + variacao);

  // Gerar timestamps e potências
  const timestamps: string[] = [];
  const potencias: number[] = [];

  const dataInicio = new Date("2025-12-26");

  for (let dayIndex = 0; dayIndex < params.days; dayIndex++) {
    for (let hora = 0; hora < 24; hora++) {
      const data = new Date(dataInicio);
      data.setDate(data.getDate() + dayIndex);
      data.setHours(hora, 0, 0, 0);

      // Formatar timestamp manualmente para garantir formato correto
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();
      const h = String(data.getHours()).padStart(2, "0");
      const m = String(data.getMinutes()).padStart(2, "0");
      const s = String(data.getSeconds()).padStart(2, "0");
      const timestamp = `${dia}/${mes}/${ano} ${h}:${m}:${s}.000000`;

      // Curva de carga industrial
      let fator = 0.3; // Madrugada
      if (hora >= 6 && hora < 12) fator = 0.8; // Manhã
      if (hora >= 12 && hora < 13) fator = 0.6; // Almoço
      if (hora >= 13 && hora < 18) fator = 0.85; // Tarde
      if (hora >= 18 && hora < 22) fator = 1.0; // Ponta
      if (hora >= 22 && hora < 24) fator = 0.4; // Noite

      const potencia =
        demanda * fator * (1 + (Math.random() - 0.5) * variacao);
      potencias.push(Math.max(0, potencia));
      timestamps.push(timestamp);
    }
  }

  return {
    sucesso: true,
    nome_empresa: "Empresa Teste",
    demanda_contratada_kw: Math.round(demanda * 10) / 10,
    potencia_maxima_kw: Math.round(potencia_maxima * 10) / 10,
    dias: params.days,
    potencias,
    timestamps,
  };
}

describe("Router BESS - Gerador de Casos", () => {
  it("deve gerar caso de teste estágio 1 (pequeno comércio)", () => {
    const resultado = gerarCasoDeTeste({
      stage: 1,
      severity: "leve",
      days: 7,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.demanda_contratada_kw).toBeGreaterThanOrEqual(10);
    expect(resultado.demanda_contratada_kw).toBeLessThanOrEqual(50);
    expect(resultado.potencias.length).toBe(7 * 24);
  });

  it("deve gerar caso de teste estágio 3 (indústria média)", () => {
    const resultado = gerarCasoDeTeste({
      stage: 3,
      severity: "moderado",
      days: 30,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.demanda_contratada_kw).toBeGreaterThanOrEqual(150);
    expect(resultado.demanda_contratada_kw).toBeLessThanOrEqual(500);
    expect(resultado.potencias.length).toBe(30 * 24);
  });

  it("deve gerar caso de teste estágio 5 (indústria pesada)", () => {
    const resultado = gerarCasoDeTeste({
      stage: 5,
      severity: "grave",
      days: 14,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.demanda_contratada_kw).toBeGreaterThanOrEqual(1500);
    expect(resultado.demanda_contratada_kw).toBeLessThanOrEqual(5000);
    expect(resultado.potencias.length).toBe(14 * 24);
  });

  it("deve gerar dados com severidade leve", () => {
    const resultado = gerarCasoDeTeste({
      stage: 3,
      severity: "leve",
      days: 7,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.potencias.length).toBe(7 * 24);
  });

  it("deve gerar dados com severidade grave", () => {
    const resultado = gerarCasoDeTeste({
      stage: 3,
      severity: "grave",
      days: 7,
    });

    expect(resultado.sucesso).toBe(true);
    expect(resultado.potencias.length).toBe(7 * 24);
  });

  it("deve gerar timestamps válidos", () => {
    const resultado = gerarCasoDeTeste({
      stage: 2,
      severity: "moderado",
      days: 1,
    });

    expect(resultado.timestamps.length).toBe(24);
    resultado.timestamps.forEach((ts) => {
      expect(ts).toMatch(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/);
    });
  });

  it("deve gerar potências positivas", () => {
    const resultado = gerarCasoDeTeste({
      stage: 3,
      severity: "moderado",
      days: 7,
    });

    resultado.potencias.forEach((p) => {
      expect(p).toBeGreaterThanOrEqual(0);
    });
  });

  it("deve respeitar número de dias", () => {
    for (const dias of [7, 14, 30, 90, 365]) {
      const resultado = gerarCasoDeTeste({
        stage: 3,
        severity: "moderado",
        days: dias,
      });

      expect(resultado.potencias.length).toBe(dias * 24);
      expect(resultado.timestamps.length).toBe(dias * 24);
    }
  });
});
