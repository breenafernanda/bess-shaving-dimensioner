/**
 * PÁGINA: Gerador de Casos de Teste
 * 
 * Permite criar arquivos Excel realistas com curvas de carga industriais
 * para simular diferentes cenários de empresas.
 */

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Loader2, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

/**
 * Configuração dos estágios de empresa
 */
const COMPANY_STAGES = [
  {
    id: 1,
    name: "Pequeno Comércio",
    description: "Padaria, loja de roupas, pequeno varejo",
    range: "10 - 50 kW",
    minKw: 10,
    maxKw: 50,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    name: "Pequena Indústria",
    description: "Oficina mecânica, fábrica pequena",
    range: "50 - 150 kW",
    minKw: 50,
    maxKw: 150,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Indústria Média",
    description: "Fábrica de médio porte, processamento",
    range: "150 - 500 kW",
    minKw: 150,
    maxKw: 500,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    name: "Indústria Grande",
    description: "Fábrica grande, centro de distribuição",
    range: "500 - 1.500 kW",
    minKw: 500,
    maxKw: 1500,
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: 5,
    name: "Indústria Pesada",
    description: "Siderurgia, petroquímica, grande consumidor",
    range: "1.500 - 5.000 kW",
    minKw: 1500,
    maxKw: 5000,
    color: "bg-red-100 text-red-800",
  },
];

/**
 * Configuração dos níveis de severidade
 */
const SEVERITY_LEVELS = [
  {
    id: "leve",
    name: "Leve",
    description: "Consumo regular e previsível",
    details: "Variação ±5%, picos até 10% acima da demanda",
    color: "bg-green-50 border-green-200",
    icon: "📊",
  },
  {
    id: "moderado",
    name: "Moderado",
    description: "Consumo oscilante",
    details: "Variação ±15%, picos até 25% acima da demanda",
    color: "bg-yellow-50 border-yellow-200",
    icon: "📈",
  },
  {
    id: "grave",
    name: "Grave",
    description: "Consumo muito variável com picos significativos",
    details: "Variação ±30%, picos até 50% acima da demanda",
    color: "bg-red-50 border-red-200",
    icon: "⚠️",
  },
];

/**
 * Opções de período
 */
const PERIOD_OPTIONS = [
  { value: 7, label: "1 Semana (7 dias)" },
  { value: 14, label: "2 Semanas (14 dias)" },
  { value: 30, label: "1 Mês (30 dias)" },
  { value: 60, label: "2 Meses (60 dias)" },
  { value: 90, label: "3 Meses (90 dias)" },
  { value: 180, label: "6 Meses (180 dias)" },
  { value: 365, label: "1 Ano (365 dias)" },
];

/**
 * Gera dados de preview da curva de carga para um dia específico
 */
function generateLoadCurveForDay(
  stage: number,
  severity: "leve" | "moderado" | "grave",
  dayIndex: number,
  seed: number
): Array<{ hora: string; potencia: number }> {
  // Ranges de demanda por estágio
  const ranges: Record<number, [number, number]> = {
    1: [10, 50],
    2: [50, 150],
    3: [150, 500],
    4: [500, 1500],
    5: [1500, 5000],
  };

  const [min, max] = ranges[stage] || [100, 200];
  
  // Usar seed para gerar demanda consistente por dia
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const demanda = min + seededRandom(seed + dayIndex) * (max - min);

  // Variabilidade conforme severidade
  const variabilidade: Record<string, number> = {
    leve: 0.05,
    moderado: 0.15,
    grave: 0.3,
  };

  const variacao = variabilidade[severity] || 0.15;

  // Gerar 24 horas para o dia
  const dados: Array<{ hora: string; potencia: number }> = [];

  for (let hora = 0; hora < 24; hora++) {
    // Curva de carga industrial
    let fator = 0.3; // Madrugada
    if (hora >= 6 && hora < 12) fator = 0.8; // Manhã
    if (hora >= 12 && hora < 13) fator = 0.6; // Almoço
    if (hora >= 13 && hora < 18) fator = 0.85; // Tarde
    if (hora >= 18 && hora < 22) fator = 1.0; // Ponta
    if (hora >= 22 && hora < 24) fator = 0.4; // Noite

    // Usar seed para gerar valores consistentes
    const randomValue = seededRandom(seed + dayIndex * 100 + hora);
    const potencia = demanda * fator * (1 + (randomValue - 0.5) * variacao);

    dados.push({
      hora: `${String(hora).padStart(2, "0")}:00`,
      potencia: Math.max(0, Math.round(potencia * 10) / 10),
    });
  }

  return dados;
}

export default function TestCaseGenerator() {
  // Estado
  const [selectedStage, setSelectedStage] = useState<number>(3);
  const [selectedSeverity, setSelectedSeverity] = useState<"leve" | "moderado" | "grave">("moderado");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [currentDayPage, setCurrentDayPage] = useState<number>(1);
  const [generationResult, setGenerationResult] = useState<any>(null);

  // Seed para gerar curvas consistentes
  const seed = useMemo(() => Math.random() * 10000, [selectedStage, selectedSeverity, selectedPeriod]);

  // Gerar preview da curva de carga para o dia atual
  const loadCurvePreview = useMemo(() => {
    return generateLoadCurveForDay(selectedStage, selectedSeverity, currentDayPage - 1, seed);
  }, [selectedStage, selectedSeverity, currentDayPage, seed]);

  // Integração futura: aqui será feita a chamada para FastAPI
  // const generateMutation = ...

  /**
   * Gera um novo caso de teste usando FastAPI (substituir chamada abaixo)
   */
  const handleGenerateTestCase = async () => {
    setGenerationResult(null);
    // TODO: Substituir por chamada REST para FastAPI
    // Exemplo:
    // const response = await fetch('/api/generate-test-case', { ... })
    // const data = await response.json();
    // setGenerationResult(data)
  };

  /**
   * Faz download do arquivo gerado
   */
  const handleDownloadFile = () => {
    if (generationResult?.arquivo) {
      const link = document.createElement("a");
      link.href = generationResult.arquivo;
      link.download = `${generationResult.nome_empresa}.xlsx`;
      link.click();
    }
  };

  /**
   * Navega para o dia anterior
   */
  const handlePreviousDay = () => {
    if (currentDayPage > 1) {
      setCurrentDayPage(currentDayPage - 1);
    }
  };

  /**
   * Navega para o próximo dia
   */
  const handleNextDay = () => {
    if (currentDayPage < selectedPeriod) {
      setCurrentDayPage(currentDayPage + 1);
    }
  };

  // Configurações selecionadas
  const selectedStageConfig = COMPANY_STAGES.find((s) => s.id === selectedStage);
  const selectedSeverityConfig = SEVERITY_LEVELS.find(
    (s) => s.id === selectedSeverity
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Gerador de Casos de Teste
          </h1>
          <p className="text-lg text-slate-600">
            Crie arquivos Excel realistas com curvas de carga industriais para
            simular diferentes cenários
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Painel de Configuração */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seleção de Estágio */}
            <Card>
              <CardHeader>
                <CardTitle>1. Selecione o Tamanho da Empresa</CardTitle>
                <CardDescription>
                  Escolha o estágio que melhor representa sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMPANY_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => setSelectedStage(stage.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedStage === stage.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-slate-900">
                        {stage.name}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {stage.description}
                      </div>
                      <Badge className="mt-2" variant="outline">
                        {stage.range}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Severidade */}
            <Card>
              <CardHeader>
                <CardTitle>2. Escolha o Nível de Severidade</CardTitle>
                <CardDescription>
                  Define a variabilidade do consumo de energia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SEVERITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedSeverity(level.id as "leve" | "moderado" | "grave")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedSeverity === level.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{level.icon}</div>
                      <div className="font-semibold text-slate-900">
                        {level.name}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {level.description}
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        {level.details}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Período */}
            <Card>
              <CardHeader>
                <CardTitle>3. Defina o Período de Análise</CardTitle>
                <CardDescription>
                  Quantidade de dias para simular
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dias: {selectedPeriod}</Label>
                  <Slider
                    min={7}
                    max={365}
                    step={1}
                    value={[selectedPeriod]}
                    onValueChange={(value) => {
                      setSelectedPeriod(value[0]);
                      setCurrentDayPage(1); // Reset para primeiro dia
                    }}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PERIOD_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => {
                        setSelectedPeriod(option.value);
                        setCurrentDayPage(1); // Reset para primeiro dia
                      }}
                      variant={selectedPeriod === option.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botão Gerar */}
            <Button
              onClick={handleGenerateTestCase}
              disabled={generateMutation.isPending}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Caso de Teste...
                </>
              ) : (
                "Gerar Caso de Teste"
              )}
            </Button>
          </div>

          {/* Painel de Preview e Resultado */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resumo de Configuração */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Resumo da Configuração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Tamanho da Empresa</div>
                  <div className="font-semibold text-slate-900">
                    {selectedStageConfig?.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedStageConfig?.range}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm text-slate-600 mb-1">Severidade</div>
                  <div className="font-semibold text-slate-900">
                    {selectedSeverityConfig?.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {selectedSeverityConfig?.details}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-sm text-slate-600 mb-1">Período</div>
                  <div className="font-semibold text-slate-900">
                    {selectedPeriod} dias ({selectedPeriod * 24} horas)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview da Curva de Carga */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview - Curva de Carga</CardTitle>
                <CardDescription>
                  Dia {currentDayPage} de {selectedPeriod} ({selectedPeriod * 24} horas totais)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Gráfico */}
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={loadCurvePreview}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="hora"
                        stroke="#64748b"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        stroke="#64748b"
                        style={{ fontSize: "12px" }}
                        label={{ value: "Potência (kW)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                        formatter={(value) => [`${value} kW`, "Potência"]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="potencia"
                        stroke="#3b82f6"
                        dot={false}
                        strokeWidth={2}
                        name="Potência (kW)"
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Paginação de Dias */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t">
                  <Button
                    onClick={handlePreviousDay}
                    disabled={currentDayPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 text-center">
                    <div className="text-sm font-semibold text-slate-900">
                      Dia {currentDayPage} de {selectedPeriod}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {Math.ceil((currentDayPage / selectedPeriod) * 100)}% do período
                    </div>
                  </div>

                  <Button
                    onClick={handleNextDay}
                    disabled={currentDayPage === selectedPeriod}
                    variant="outline"
                    size="sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Seletor Rápido de Dias */}
                <div className="space-y-2">
                  <Label className="text-xs">Ir para dia:</Label>
                  <div className="flex gap-1 flex-wrap">
                    {Array.from({ length: Math.min(selectedPeriod, 7) }).map((_, i) => {
                      const dayNum = i + 1;
                      return (
                        <Button
                          key={dayNum}
                          onClick={() => setCurrentDayPage(dayNum)}
                          variant={currentDayPage === dayNum ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          Dia {dayNum}
                        </Button>
                      );
                    })}
                    {selectedPeriod > 7 && (
                      <Button
                        onClick={() => setCurrentDayPage(selectedPeriod)}
                        variant={currentDayPage === selectedPeriod ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                      >
                        Último
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
