/**
 * COMPONENTE: Configurador de Tarifas
 * 
 * Permite configurar as tarifas de energia (ponta, intermediária, fora-ponta)
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, AlertCircle } from "lucide-react";

interface TariffConfig {
  tarifa_ponta: number;
  tarifa_intermediaria: number;
  tarifa_fora_ponta: number;
  cobranca_demanda: number;
}

interface ConfiguradorTarifaProps {
  currentConfig: TariffConfig;
  analysisResult: any;
  onUpdate: (config: TariffConfig) => void;
  onNext: () => void;
}

export default function ConfiguradorTarifa({
  currentConfig,
  analysisResult,
  onUpdate,
  onNext,
}: ConfiguradorTarifaProps) {
  const [config, setConfig] = useState<TariffConfig>(currentConfig);

  /**
   * Atualiza valor de tarifa
   */
  const handleTarifaChange = (field: keyof TariffConfig, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newConfig = { ...config, [field]: numValue };
    setConfig(newConfig);
    onUpdate(newConfig);
  };

  /**
   * Carrega tarifas padrão CEMIG Uberaba
   */
  const loadCemigTarifas = () => {
    const cemigConfig: TariffConfig = {
      tarifa_ponta: 1.71,
      tarifa_intermediaria: 1.12,
      tarifa_fora_ponta: 0.72,
      cobranca_demanda: 50,
    };
    setConfig(cemigConfig);
    onUpdate(cemigConfig);
  };

  /**
   * Calcula economia estimada
   */
  const calcularEconomiaEstimada = () => {
    const classificacao = analysisResult?.classificacao;
    if (!classificacao) return 0;

    // Economia na ponta (redução de 20% da demanda)
    const consumo_ponta = classificacao.ponta.total;
    const reducao_ponta = consumo_ponta * 0.2;
    const economia_ponta = reducao_ponta * config.tarifa_ponta;

    // Custo de carregamento na madrugada
    const custo_carregamento = reducao_ponta * config.tarifa_fora_ponta;

    // Economia líquida
    return economia_ponta - custo_carregamento;
  };

  const economiaEstimada = calcularEconomiaEstimada();

  return (
    <div className="space-y-6">
      {/* Alert Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure as tarifas de energia para sua região. Você pode usar os valores padrão da CEMIG Uberaba ou inserir seus próprios valores.
        </AlertDescription>
      </Alert>

      {/* Tarifas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração de Tarifas
          </CardTitle>
          <CardDescription>
            Valores em R$/kWh e R$/kW/mês
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Botão CEMIG */}
          <Button
            onClick={loadCemigTarifas}
            variant="outline"
            className="w-full"
          >
            Carregar Tarifas Padrão CEMIG Uberaba
          </Button>

          {/* Grid de Tarifas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarifa Ponta */}
            <div className="space-y-2">
              <Label htmlFor="tarifa_ponta" className="text-base font-semibold">
                Tarifa Ponta
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">R$</span>
                <Input
                  id="tarifa_ponta"
                  type="number"
                  step="0.01"
                  value={config.tarifa_ponta}
                  onChange={(e) => handleTarifaChange("tarifa_ponta", e.target.value)}
                  className="text-lg font-semibold"
                />
                <span className="text-sm text-slate-600">/kWh</span>
              </div>
              <p className="text-xs text-slate-500">
                Horário de ponta: 18h-21h (seg-sex)
              </p>
            </div>

            {/* Tarifa Intermediária */}
            <div className="space-y-2">
              <Label htmlFor="tarifa_intermediaria" className="text-base font-semibold">
                Tarifa Intermediária
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">R$</span>
                <Input
                  id="tarifa_intermediaria"
                  type="number"
                  step="0.01"
                  value={config.tarifa_intermediaria}
                  onChange={(e) => handleTarifaChange("tarifa_intermediaria", e.target.value)}
                  className="text-lg font-semibold"
                />
                <span className="text-sm text-slate-600">/kWh</span>
              </div>
              <p className="text-xs text-slate-500">
                Horário intermediário: 17h-22h (seg-sex, exceto ponta)
              </p>
            </div>

            {/* Tarifa Fora de Ponta */}
            <div className="space-y-2">
              <Label htmlFor="tarifa_fora_ponta" className="text-base font-semibold">
                Tarifa Fora de Ponta
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">R$</span>
                <Input
                  id="tarifa_fora_ponta"
                  type="number"
                  step="0.01"
                  value={config.tarifa_fora_ponta}
                  onChange={(e) => handleTarifaChange("tarifa_fora_ponta", e.target.value)}
                  className="text-lg font-semibold"
                />
                <span className="text-sm text-slate-600">/kWh</span>
              </div>
              <p className="text-xs text-slate-500">
                Horário fora de ponta: resto do dia
              </p>
            </div>

            {/* Cobrança de Demanda */}
            <div className="space-y-2">
              <Label htmlFor="cobranca_demanda" className="text-base font-semibold">
                Cobrança de Demanda
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">R$</span>
                <Input
                  id="cobranca_demanda"
                  type="number"
                  step="0.01"
                  value={config.cobranca_demanda}
                  onChange={(e) => handleTarifaChange("cobranca_demanda", e.target.value)}
                  className="text-lg font-semibold"
                />
                <span className="text-sm text-slate-600">/kW/mês</span>
              </div>
              <p className="text-xs text-slate-500">
                Valor cobrado por kW de demanda contratada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Tarifas */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Resumo de Tarifas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-blue-700 mb-1">Ponta</div>
              <div className="text-2xl font-bold text-blue-900">
                R$ {config.tarifa_ponta.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-700 mb-1">Intermediária</div>
              <div className="text-2xl font-bold text-blue-900">
                R$ {config.tarifa_intermediaria.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-700 mb-1">Fora de Ponta</div>
              <div className="text-2xl font-bold text-blue-900">
                R$ {config.tarifa_fora_ponta.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-blue-700 mb-1">Demanda</div>
              <div className="text-2xl font-bold text-blue-900">
                R$ {config.cobranca_demanda.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economia Estimada */}
      {economiaEstimada > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-green-700 mb-2">Economia Estimada (período analisado)</p>
              <p className="text-4xl font-bold text-green-900">
                R$ {economiaEstimada.toFixed(2)}
              </p>
              <p className="text-xs text-green-700 mt-2">
                Baseado em redução de 20% de demanda na ponta
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão Próximo */}
      <Button onClick={onNext} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
        Prosseguir para Dimensionamento
      </Button>
    </div>
  );
}
