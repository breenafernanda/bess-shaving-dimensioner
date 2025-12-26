/**
 * COMPONENTE: Simulador de BESS
 * 
 * Realiza simulação dia a dia do sistema BESS com diferentes estratégias de carregamento
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { Loader2, Sun, Grid3x3, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SimuladorComponentProps {
  uploadData: any;
  dimensionamento: any;
  tariffConfig: any;
  onComplete: (result: any) => void;
}

export default function SimuladorComponent({
  uploadData,
  dimensionamento,
  tariffConfig,
  onComplete,
}: SimuladorComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [estrategia, setEstrategia] = useState<"solar" | "grid-offpeak">("grid-offpeak");
  const [resultado, setResultado] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  /**
   * Realiza simulação
   */
  const handleSimular = async () => {
    setIsLoading(true);
    try {
      // Simular chamada ao backend
      const response = await fetch("/api/trpc/bess.simular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          potencias: uploadData.potencias,
          timestamps: uploadData.timestamps,
          capacidade_bess_kwh: dimensionamento.dimensionamento.capacidade_bess_kwh,
          potencia_bess_kw: dimensionamento.dimensionamento.potencia_bess_kw,
          estrategia_carregamento: estrategia,
          tarifa_ponta: tariffConfig.tarifa_ponta,
          tarifa_intermediaria: tariffConfig.tarifa_intermediaria,
          tarifa_fora_ponta: tariffConfig.tarifa_fora_ponta,
          cobranca_demanda: tariffConfig.cobranca_demanda,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao simular");
      }

      const result = await response.json();

      if (!result.sucesso) {
        throw new Error(result.erro || "Erro ao simular BESS");
      }

      setResultado(result.dados);

      // Preparar dados para gráfico (primeiros 7 dias)
      if (result.dados.resultados_diarios) {
        const dados = result.dados.resultados_diarios.slice(0, 7).map((dia: any, idx: number) => ({
          dia: idx + 1,
          demanda_original: dia.demanda_max_original_kw,
          demanda_com_bess: dia.demanda_max_com_bess_kw,
          economia: dia.economia_liquida_reais,
          soc: dia.soc_final_percent,
        }));
        setChartData(dados);
      }

      onComplete(result.dados);
      toast.success("Simulação concluída!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao simular");
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
          Escolha a estratégia de carregamento do BESS e execute a simulação para ver os resultados dia a dia.
        </AlertDescription>
      </Alert>

      {/* Seleção de Estratégia */}
      <Card>
        <CardHeader>
          <CardTitle>Estratégia de Carregamento</CardTitle>
          <CardDescription>
            Escolha como o BESS será carregado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Solar */}
            <button
              onClick={() => setEstrategia("solar")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                estrategia === "solar"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <Sun className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Carregamento Solar</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    O BESS carrega durante o dia com geração própria (solar/renovável)
                  </p>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1">
                    <li>✓ Sem custo de carregamento</li>
                    <li>✓ Ideal para empresas com geração própria</li>
                    <li>✓ Máxima economia</li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Grid Off-Peak */}
            <button
              onClick={() => setEstrategia("grid-offpeak")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                estrategia === "grid-offpeak"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <Grid3x3 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Carregamento na Madrugada</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    O BESS carrega na madrugada (00-06h) com tarifa baixa da concessionária
                  </p>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1">
                    <li>✓ Tarifa mais barata</li>
                    <li>✓ Sem necessidade de geração própria</li>
                    <li>✓ Mais previsível</li>
                  </ul>
                </div>
              </div>
            </button>
          </div>

          {/* Botão Simular */}
          <Button
            onClick={handleSimular}
            disabled={isLoading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Executar Simulação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultado && (
        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="grafico">Gráficos</TabsTrigger>
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          </TabsList>

          {/* Resumo */}
          <TabsContent value="resumo" className="space-y-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Resumo da Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-green-700 mb-1">Economia Total</div>
                    <div className="text-3xl font-bold text-green-900">
                      R$ {resultado.resumo?.economia_total_periodo_reais?.toLocaleString('pt-BR')}
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      {resultado.resumo?.dias_simulados} dias
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-green-700 mb-1">Economia Anual (Estimada)</div>
                    <div className="text-3xl font-bold text-green-900">
                      R$ {resultado.resumo?.economia_anual_estimada_reais?.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-700 mb-1">Redução de Demanda</div>
                    <div className="text-3xl font-bold text-green-900">
                      {resultado.resumo?.reducao_demanda_media_kw} kW
                    </div>
                    <p className="text-xs text-green-700 mt-1">
                      Média por dia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown de Economia */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Breakdown de Economia Anual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span className="text-slate-700">Economia de Energia (Ponta)</span>
                    <span className="font-bold text-slate-900">
                      R$ {(resultado.resumo?.economia_anual_estimada_reais * 0.55).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded">
                    <span className="text-slate-700">Economia de Demanda Contratada</span>
                    <span className="font-bold text-slate-900">
                      R$ {resultado.resumo?.economia_demanda_anual_reais?.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Total Anual</span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {resultado.resumo?.economia_anual_estimada_reais?.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gráficos */}
          <TabsContent value="grafico" className="space-y-4">
            {chartData.length > 0 && (
              <>
                {/* Demanda Original vs Com BESS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Demanda Original vs Com BESS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" label={{ value: "Dia", position: "insideBottomRight", offset: -5 }} />
                        <YAxis label={{ value: "Demanda (kW)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demanda_original" fill="#ef4444" name="Original" />
                        <Bar dataKey="demanda_com_bess" fill="#10b981" name="Com BESS" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Economia Diária */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Economia Diária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" label={{ value: "Dia", position: "insideBottomRight", offset: -5 }} />
                        <YAxis label={{ value: "Economia (R$)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="economia"
                          stroke="#10b981"
                          dot={{ fill: "#10b981" }}
                          name="Economia (R$)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Detalhes */}
          <TabsContent value="detalhes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded">
                      <span className="text-slate-600">Estratégia</span>
                      <div className="font-semibold text-slate-900 mt-1">
                        {estrategia === "solar" ? "Carregamento Solar" : "Carregamento Madrugada"}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <span className="text-slate-600">Dias Simulados</span>
                      <div className="font-semibold text-slate-900 mt-1">
                        {resultado.resumo?.dias_simulados}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <span className="text-slate-600">Potência BESS</span>
                      <div className="font-semibold text-slate-900 mt-1">
                        {dimensionamento.dimensionamento.potencia_bess_kw} kW
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded">
                      <span className="text-slate-600">Capacidade BESS</span>
                      <div className="font-semibold text-slate-900 mt-1">
                        {dimensionamento.dimensionamento.capacidade_bess_kwh} kWh
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
