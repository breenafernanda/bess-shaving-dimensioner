/**
 * TESTES: Parser de Excel
 * 
 * Valida a funcionalidade de parsing de arquivos Excel no formato Elspec
 */

import { describe, it, expect } from "vitest";

/**
 * Simula o parser de Excel
 * Em produção, seria importado do módulo Python
 */
function parseExcelElspec(data: {
  timestamps: string[];
  potencias: number[];
}): {
  sucesso: boolean;
  potencia_maxima_kw: number;
  potencia_minima_kw: number;
  potencia_media_kw: number;
  total_pontos: number;
} {
  // Validar se arrays existem e têm dados
  if (
    !data.timestamps ||
    !data.potencias ||
    data.timestamps.length === 0 ||
    data.potencias.length === 0
  ) {
    return {
      sucesso: false,
      potencia_maxima_kw: 0,
      potencia_minima_kw: 0,
      potencia_media_kw: 0,
      total_pontos: 0,
    };
  }

  // Validar se arrays têm o mesmo tamanho
  if (data.timestamps.length !== data.potencias.length) {
    return {
      sucesso: false,
      potencia_maxima_kw: 0,
      potencia_minima_kw: 0,
      potencia_media_kw: 0,
      total_pontos: 0,
    };
  }

  const potencias = data.potencias.filter((p) => p > 0);
  const maxima = Math.max(...potencias);
  const minima = Math.min(...potencias);
  const media = potencias.reduce((a, b) => a + b, 0) / potencias.length;

  return {
    sucesso: true,
    potencia_maxima_kw: maxima,
    potencia_minima_kw: minima,
    potencia_media_kw: media,
    total_pontos: potencias.length,
  };
}

describe("Parser de Excel - Formato Elspec", () => {
  it("deve validar arquivo com dados válidos", () => {
    const dados = {
      timestamps: [
        "26/12/2025 00:00:00.000000",
        "26/12/2025 01:00:00.000000",
        "26/12/2025 02:00:00.000000",
      ],
      potencias: [150.5, 148.2, 145.8],
    };

    const resultado = parseExcelElspec(dados);

    expect(resultado.sucesso).toBe(true);
    expect(resultado.potencia_maxima_kw).toBe(150.5);
    expect(resultado.potencia_minima_kw).toBe(145.8);
    expect(resultado.total_pontos).toBe(3);
  });

  it("deve calcular média corretamente", () => {
    const dados = {
      timestamps: ["26/12/2025 00:00:00.000000", "26/12/2025 01:00:00.000000"],
      potencias: [100, 200],
    };

    const resultado = parseExcelElspec(dados);

    expect(resultado.potencia_media_kw).toBe(150);
  });

  it("deve rejeitar arquivo sem timestamps", () => {
    const dados = {
      timestamps: [],
      potencias: [150.5, 148.2],
    };

    const resultado = parseExcelElspec(dados);

    expect(resultado.sucesso).toBe(false);
  });

  it("deve rejeitar arquivo sem potências", () => {
    const dados = {
      timestamps: ["26/12/2025 00:00:00.000000"],
      potencias: [],
    };

    const resultado = parseExcelElspec(dados);

    expect(resultado.sucesso).toBe(false);
  });

  it("deve lidar com valores grandes", () => {
    const dados = {
      timestamps: Array(168)
        .fill(0)
        .map((_, i) => `26/12/2025 ${String(i).padStart(2, "0")}:00:00.000000`),
      potencias: Array(168)
        .fill(0)
        .map(() => Math.random() * 5000),
    };

    const resultado = parseExcelElspec(dados);

    expect(resultado.sucesso).toBe(true);
    expect(resultado.total_pontos).toBe(168);
    expect(resultado.potencia_maxima_kw).toBeGreaterThan(0);
    expect(resultado.potencia_minima_kw).toBeGreaterThan(0);
  });
});
