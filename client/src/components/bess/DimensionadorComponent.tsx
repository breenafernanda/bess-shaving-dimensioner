/**
 * COMPONENTE: Dimensionador de BESS
 * 
 * Calcula potência e capacidade necessárias do BESS
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Zap, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface DimensionadorComponentProps {
  uploadData: any;
  analysisResult: any;
  tariffConfig: any;
  onComplete: (result: any) => void;
}

export default function DimensionadorComponent({
  uploadData,
  analysisResult,
  tariffConfig,
  onComplete,
}: DimensionadorComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reducaoPercent, setReducaoPercent] = useState(20);
  const [custoInvestimento, setCustoInvestimento] = useState(200000);
  const [resultado, setResultado] = useState<any>(null);

  /**
   * Realiza dimensionamento
   */
  const handleDimensionar = async () => {
    setIsLoading(true);
    try {

      // Chamada ao backend FastAPI (ajuste o endpoint conforme necessário)
      const response = await fetch("http://localhost:9000/api/dimensionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          potencias: uploadData.potencias,
          timestamps: uploadData.timestamps,
          tarifa_ponta: tariffConfig.tarifa_ponta,
          tarifa_fora_ponta: tariffConfig.tarifa_fora_ponta,
          cobranca_demanda: tariffConfig.cobranca_demanda,
          reducao_demanda_percent: reducaoPercent,
          custo_investimento_reais: custoInvestimento,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao dimensionar");
      }

      const result = await response.json();

      if (!result.sucesso) {
        throw new Error(result.erro || "Erro ao dimensionar BESS");
      }

      setResultado(result.dados);
      onComplete(result.dados);
      toast.success("Dimensionamento concluído!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao dimensionar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure os parâmetros de dimensionamento do BESS baseado em seus objetivos de redução de demanda.
        </AlertDescription>
      </Alert>

      {/* Parâmetros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Parâmetros de Dimensionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Redução de Demanda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Redução de Demanda Desejada
              </Label>
              <span className="text-2xl font-bold text-blue-600">
                {reducaoPercent}%
              </span>
            </div>
            <Slider
              min={5}
              max={50}
              step={1}
              value={[reducaoPercent]}
              onValueChange={(value) => setReducaoPercent(value[0])}
              className="w-full"
            />
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[10, 20, 30, 40, 50].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setReducaoPercent(percent)}
                  className={`p-2 rounded border transition-all ${
                    reducaoPercent === percent
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              Quanto maior a redução, maior o BESS necessário
            </p>
          </div>

          {/* Custo de Investimento */}
          <div className="space-y-2">
            <Label htmlFor="custo" className="text-base font-semibold">
              Custo de Investimento (R$)
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">R$</span>
              <Input
                id="custo"
                type="number"
                step="10000"
                value={custoInvestimento}
                onChange={(e) => setCustoInvestimento(parseFloat(e.target.value) || 0)}
                className="text-lg font-semibold"
              />
            </div>
            <p className="text-sm text-slate-600">
              Custo total do sistema BESS (equipamento + instalação)
            </p>
          </div>

          {/* Botão Dimensionar */}
          <Button
            onClick={handleDimensionar}
            disabled={isLoading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dimensionando...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Dimensionar BESS
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <div className="space-y-4">
          {/* Dimensionamento */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg">Dimensionamento Recomendado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-blue-700 mb-1">Potência BESS</div>
                  <div className="text-3xl font-bold text-blue-900">
                    {resultado.dimensionamento?.potencia_bess_kw} kW
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Capacidade BESS</div>
                  <div className="text-3xl font-bold text-blue-900">
                    {resultado.dimensionamento?.capacidade_bess_kwh} kWh
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Custo/kWh</div>
                  <div className="text-3xl font-bold text-blue-900">
                    R$ {resultado.custo_por_kwh}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-blue-700 mb-1">Custo/kW</div>
                  <div className="text-3xl font-bold text-blue-900">
                    R$ {resultado.custo_por_kw}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análise Financeira */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Análise Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-green-700 mb-1">Economia Anual</div>
                  <div className="text-2xl font-bold text-green-900">
                    R$ {resultado.economia?.economia_total_anual_reais?.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Demanda: R$ {resultado.economia?.economia_demanda_anual_reais?.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-green-700">
                    Energia: R$ {resultado.economia?.economia_energia_anual_reais?.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">Payback</div>
                  <div className="text-2xl font-bold text-green-900">
                    {resultado.payback?.payback_anos} anos
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {resultado.payback?.viavel ? "✅ Viável" : "⚠️ Não viável"}
                  </p>
                </div>
                <div>
                  <div className="text-sm text-green-700 mb-1">ROI (10 anos)</div>
                  <div className="text-2xl font-bold text-green-900">
                    {resultado.payback?.roi_10anos_percent}%
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Lucro: R$ {resultado.payback?.lucro_10anos_reais?.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes do Dimensionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Demanda Contratada:</span>
                  <div className="font-semibold">
                    {resultado.dimensionamento?.demanda_contratada_kw} kW
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Pico Ponta:</span>
                  <div className="font-semibold">
                    {resultado.dimensionamento?.pico_demanda_ponta_kw} kW
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Pico Médio Ponta:</span>
                  <div className="font-semibold">
                    {resultado.dimensionamento?.pico_medio_ponta_kw} kW
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Redução Demanda:</span>
                  <div className="font-semibold">
                    {resultado.economia?.reducao_demanda_kw} kW
                  </div>
                </div>
                <div>
                  <span className="text-slate-600">Energia Descargada/Ano:</span>
                  <div className="font-semibold">
                    {resultado.economia?.energia_descargada_anual_kwh} kWh
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
