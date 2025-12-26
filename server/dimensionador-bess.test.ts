/**
 * TESTES: Dimensionador de BESS
 * 
 * Valida os cálculos de potência, capacidade e análise financeira
 */

import { describe, it, expect } from "vitest";

/**
 * Interface de entrada para dimensionamento
 */
interface DimensionamentoInput {
  potencia_pico_kw: number;
  potencia_media_ponta_kw: number;
  reducao_demanda_percent: number;
  tarifa_ponta: number;
  tarifa_fora_ponta: number;
  cobranca_demanda: number;
  custo_investimento_reais: number;
}

/**
 * Simula o dimensionador de BESS
 */
function dimensionarBESS(input: DimensionamentoInput) {
  // Calcular potência necessária (20% do pico como padrão)
  const potencia_bess_kw = input.potencia_pico_kw * (input.reducao_demanda_percent / 100);

  // Calcular capacidade (4 horas de descarga + margem 20%)
  const capacidade_bess_kwh = potencia_bess_kw * 4 * 1.2;

  // Custo por kWh e kW
  const custo_por_kwh = input.custo_investimento_reais / capacidade_bess_kwh;
  const custo_por_kw = input.custo_investimento_reais / potencia_bess_kw;

  // Economia de demanda (redução × cobrança × 12 meses)
  const economia_demanda_anual = potencia_bess_kw * input.cobranca_demanda * 12;

  // Economia de energia (diferença de tarifa × energia descargada)
  const energia_descargada_anual = potencia_bess_kw * 4 * 250; // 250 dias úteis
  const diferenca_tarifa = input.tarifa_ponta - input.tarifa_fora_ponta;
  const economia_energia_anual = energia_descargada_anual * diferenca_tarifa;

  // Economia total
  const economia_total_anual = economia_demanda_anual + economia_energia_anual;

  // Payback
  const payback_anos = input.custo_investimento_reais / economia_total_anual;

  // ROI 10 anos
  const lucro_10anos = economia_total_anual * 10 - input.custo_investimento_reais;
  const roi_10anos_percent = (lucro_10anos / input.custo_investimento_reais) * 100;

  return {
    potencia_bess_kw: Math.round(potencia_bess_kw * 10) / 10,
    capacidade_bess_kwh: Math.round(capacidade_bess_kwh * 10) / 10,
    custo_por_kwh: Math.round(custo_por_kwh * 100) / 100,
    custo_por_kw: Math.round(custo_por_kw * 100) / 100,
    economia_demanda_anual: Math.round(economia_demanda_anual),
    economia_energia_anual: Math.round(economia_energia_anual),
    economia_total_anual: Math.round(economia_total_anual),
    payback_anos: Math.round(payback_anos * 10) / 10,
    roi_10anos_percent: Math.round(roi_10anos_percent * 10) / 10,
    viavel: payback_anos <= 10,
  };
}

describe("Dimensionador de BESS", () => {
  const inputPadrao: DimensionamentoInput = {
    potencia_pico_kw: 450,
    potencia_media_ponta_kw: 400,
    reducao_demanda_percent: 20,
    tarifa_ponta: 1.71,
    tarifa_fora_ponta: 0.72,
    cobranca_demanda: 50,
    custo_investimento_reais: 200000,
  };

  it("deve calcular potência BESS corretamente", () => {
    const resultado = dimensionarBESS(inputPadrao);

    expect(resultado.potencia_bess_kw).toBe(90); // 450 * 0.2
  });

  it("deve calcular capacidade BESS com margem", () => {
    const resultado = dimensionarBESS(inputPadrao);

    // 90 * 4 * 1.2 = 432
    expect(resultado.capacidade_bess_kwh).toBe(432);
  });

  it("deve calcular custo por kWh", () => {
    const resultado = dimensionarBESS(inputPadrao);

    // 200000 / 432 ≈ 463
    expect(resultado.custo_por_kwh).toBeGreaterThan(460);
    expect(resultado.custo_por_kwh).toBeLessThan(470);
  });

  it("deve calcular economia de demanda", () => {
    const resultado = dimensionarBESS(inputPadrao);

    // 90 * 50 * 12 = 54000
    expect(resultado.economia_demanda_anual).toBe(54000);
  });

  it("deve calcular economia de energia", () => {
    const resultado = dimensionarBESS(inputPadrao);

    // 90 * 4 * 250 * (1.71 - 0.72) = 90 * 4 * 250 * 0.99
    expect(resultado.economia_energia_anual).toBeGreaterThan(89000);
    expect(resultado.economia_energia_anual).toBeLessThan(91000);
  });

  it("deve calcular payback viável", () => {
    const resultado = dimensionarBESS(inputPadrao);

    expect(resultado.payback_anos).toBeLessThan(10);
    expect(resultado.viavel).toBe(true);
  });

  it("deve calcular ROI positivo em 10 anos", () => {
    const resultado = dimensionarBESS(inputPadrao);

    expect(resultado.roi_10anos_percent).toBeGreaterThan(100);
  });

  it("deve validar cenário com redução maior", () => {
    const input = { ...inputPadrao, reducao_demanda_percent: 30 };
    const resultado = dimensionarBESS(input);

    expect(resultado.potencia_bess_kw).toBe(135); // 450 * 0.3
    expect(resultado.capacidade_bess_kwh).toBe(648); // 135 * 4 * 1.2
  });

  it("deve validar cenário com investimento maior", () => {
    const input = { ...inputPadrao, custo_investimento_reais: 400000 };
    const resultado = dimensionarBESS(input);

    expect(resultado.payback_anos).toBeGreaterThan(inputPadrao.custo_investimento_reais / 200000);
  });

  it("deve rejeitar cenário com payback > 10 anos", () => {
    const input = {
      ...inputPadrao,
      custo_investimento_reais: 1000000,
      reducao_demanda_percent: 5,
    };
    const resultado = dimensionarBESS(input);

    expect(resultado.viavel).toBe(false);
  });

  it("deve lidar com pequenas empresas", () => {
    const input: DimensionamentoInput = {
      potencia_pico_kw: 50,
      potencia_media_ponta_kw: 40,
      reducao_demanda_percent: 20,
      tarifa_ponta: 1.71,
      tarifa_fora_ponta: 0.72,
      cobranca_demanda: 50,
      custo_investimento_reais: 30000,
    };

    const resultado = dimensionarBESS(input);

    expect(resultado.potencia_bess_kw).toBe(10);
    expect(resultado.capacidade_bess_kwh).toBe(48);
    expect(resultado.economia_total_anual).toBeGreaterThan(0);
  });

  it("deve lidar com grandes empresas", () => {
    const input: DimensionamentoInput = {
      potencia_pico_kw: 2000,
      potencia_media_ponta_kw: 1800,
      reducao_demanda_percent: 25,
      tarifa_ponta: 1.71,
      tarifa_fora_ponta: 0.72,
      cobranca_demanda: 50,
      custo_investimento_reais: 1500000,
    };

    const resultado = dimensionarBESS(input);

    expect(resultado.potencia_bess_kw).toBe(500);
    expect(resultado.capacidade_bess_kwh).toBe(2400);
    expect(resultado.economia_total_anual).toBeGreaterThan(200000);
  });
});
