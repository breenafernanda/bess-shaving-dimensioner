/**
 * COMPONENTE: Visualização de Curva de Carga
 * 
 * Exibe gráfico da curva de carga original e análise de picos
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface CurvaCarregaComponentProps {
  uploadData: any;
  onComplete: (result: any) => void;
}

export default function CurvaCarregaComponent({
  uploadData,
  onComplete,
}: CurvaCarregaComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  /**
   * Realiza análise da curva
   */
  useEffect(() => {
    const performAnalysis = async () => {
      if (!uploadData) return;

      setIsLoading(true);
      try {
        // Simular análise (em produção seria uma chamada ao backend FastAPI)
        const result = {
          sucesso: true,
          analise: {
            potencia_maxima: uploadData.potencia_maxima_kw || 450,
            potencia_minima: uploadData.potencia_minima_kw || 100,
            potencia_media: uploadData.potencia_media_kw || 280,
            fator_variacao: 1.6,
            horas_pico: [18, 19, 20],
            horas_vale: [2, 3, 4, 5],
            potencial_peak_shaving_kw: 170,
          },
          classificacao: {
            ponta: {
              total: 12500,
              media: 416,
              max: 450,
              min: 380,
              pontos: 30,
            },
            intermediaria: {
              total: 8900,
              media: 356,
              max: 420,
              min: 300,
              pontos: 25,
            },
            fora_ponta: {
              total: 18200,
              media: 182,
              max: 280,
              min: 80,
              pontos: 100,
            },
          },
        };

        setAnalysisResult(result);

        // Preparar dados para gráfico
        if (uploadData.potencias && uploadData.timestamps) {
          const dados = uploadData.potencias.slice(0, 168).map((p: number, idx: number) => ({
            hora: idx,
            potencia: p,
          }));
          setChartData(dados);
        }

        // Chamar callback
        onComplete(result);
        toast.success("Análise concluída!");
      } catch (error) {
        console.error("Erro:", error);
        toast.error("Erro ao analisar curva");
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [uploadData, onComplete]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600">Analisando curva de carga...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return null;
  }

  const analise = analysisResult.analise;
  const classificacao = analysisResult.classificacao;

  return (
    <div className="space-y-6">
      {/* Gráfico de Curva de Carga */}
      <Card>
        <CardHeader>
          <CardTitle>Curva de Carga Original</CardTitle>
          <CardDescription>
            Visualização dos primeiros 7 dias de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" label={{ value: "Hora", position: "insideBottomRight", offset: -5 }} />
                <YAxis label={{ value: "Potência (kW)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="potencia"
                  stroke="#3b82f6"
                  dot={false}
                  name="Potência (kW)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-500">
              Sem dados para visualizar
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 mb-1">Potência Máxima</div>
            <div className="text-3xl font-bold text-slate-900">
              {analise.potencia_maxima.toFixed(1)} kW
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 mb-1">Potência Mínima</div>
            <div className="text-3xl font-bold text-slate-900">
              {analise.potencia_minima.toFixed(1)} kW
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 mb-1">Potência Média</div>
            <div className="text-3xl font-bold text-slate-900">
              {analise.potencia_media.toFixed(1)} kW
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 mb-1">Potencial Peak Shaving</div>
            <div className="text-3xl font-bold text-green-600">
              {analise.potencial_peak_shaving_kw.toFixed(1)} kW
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classificação por Horário */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo por Horário Tarifário</CardTitle>
          <CardDescription>
            Distribuição do consumo entre ponta, intermediária e fora-ponta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Ponta",
                data: classificacao.ponta,
                color: "bg-red-100 border-red-200",
                textColor: "text-red-900",
              },
              {
                label: "Intermediária",
                data: classificacao.intermediaria,
                color: "bg-yellow-100 border-yellow-200",
                textColor: "text-yellow-900",
              },
              {
                label: "Fora de Ponta",
                data: classificacao.fora_ponta,
                color: "bg-green-100 border-green-200",
                textColor: "text-green-900",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.color} border rounded-lg p-4`}
              >
                <div className={`font-semibold ${item.textColor} mb-2`}>
                  {item.label}
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-slate-600">Total:</span>{" "}
                    <span className="font-semibold">
                      {item.data.total.toFixed(0)} kWh
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Média:</span>{" "}
                    <span className="font-semibold">
                      {item.data.media.toFixed(1)} kW
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Máxima:</span>{" "}
                    <span className="font-semibold">
                      {item.data.max.toFixed(1)} kW
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Pontos:</span>{" "}
                    <span className="font-semibold">{item.data.pontos}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          Análise concluída! Você pode prosseguir para configurar as tarifas de energia.
        </AlertDescription>
      </Alert>
    </div>
  );
}
