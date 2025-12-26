/**
 * PÁGINA: Gerador de Casos de Teste
 * 
 * Permite criar arquivos Excel realistas com curvas de carga industriais
 * para simular diferentes cenários de empresas.
 */

import { useState } from "react";
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
import { AlertCircle, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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

export default function TestCaseGenerator() {
  // =========================================================================
  // ESTADO
  // =========================================================================

  // Estágio da empresa selecionado
  const [selectedStage, setSelectedStage] = useState<number>(3);

  // Severidade selecionada
  const [selectedSeverity, setSelectedSeverity] = useState<string>("moderado");

  // Período selecionado (dias)
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(false);

  // Resultado da geração
  const [generationResult, setGenerationResult] = useState<any>(null);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  /**
   * Gera um novo caso de teste
   */
  const handleGenerateTestCase = async () => {
    try {
      setIsLoading(true);
      setGenerationResult(null);

      // Simular chamada ao backend
      // Em produção, isso seria uma chamada tRPC
      const response = await fetch("/api/trpc/bess.generateTestCase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: selectedStage,
          severity: selectedSeverity,
          days: selectedPeriod,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar caso de teste");
      }

      const result = await response.json();
      setGenerationResult(result);

      toast.success("Caso de teste gerado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao gerar caso de teste");
    } finally {
      setIsLoading(false);
    }
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

  // =========================================================================
  // RENDER
  // =========================================================================

  const selectedStageConfig = COMPANY_STAGES.find((s) => s.id === selectedStage);
  const selectedSeverityConfig = SEVERITY_LEVELS.find(
    (s) => s.id === selectedSeverity
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  Define a variabilidade da curva de carga
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SEVERITY_LEVELS.map((severity) => (
                    <button
                      key={severity.id}
                      onClick={() => setSelectedSeverity(severity.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedSeverity === severity.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      } ${severity.color}`}
                    >
                      <div className="text-2xl mb-2">{severity.icon}</div>
                      <div className="font-semibold">{severity.name}</div>
                      <div className="text-sm mt-1">{severity.description}</div>
                      <div className="text-xs mt-2 opacity-75">
                        {severity.details}
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
                  Quantos dias de dados deseja simular?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Slider
                  min={7}
                  max={365}
                  step={1}
                  value={[selectedPeriod]}
                  onValueChange={(value) => setSelectedPeriod(value[0])}
                  className="w-full"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PERIOD_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedPeriod(option.value)}
                      className={`p-2 rounded text-sm font-medium transition-all ${
                        selectedPeriod === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {option.label.split("(")[0].trim()}
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-semibold text-blue-900">
                    Período: {selectedPeriod} dias
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {selectedPeriod * 24} pontos de dados (medições horárias)
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botão de Geração */}
            <Button
              onClick={handleGenerateTestCase}
              disabled={isLoading}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando caso de teste...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Caso de Teste
                </>
              )}
            </Button>
          </div>

          {/* Painel de Resumo */}
          <div className="space-y-6">
            {/* Resumo de Configuração */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-600">Tamanho da Empresa</Label>
                  <div className="font-semibold text-slate-900 mt-1">
                    {selectedStageConfig?.name}
                  </div>
                  <Badge className="mt-2">
                    {selectedStageConfig?.range}
                  </Badge>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-slate-600">Severidade</Label>
                  <div className="font-semibold text-slate-900 mt-1">
                    {selectedSeverityConfig?.name}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    {selectedSeverityConfig?.details}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-slate-600">Período</Label>
                  <div className="font-semibold text-slate-900 mt-1">
                    {selectedPeriod} dias
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    {selectedPeriod * 24} medições horárias
                  </div>
                </div>

                {generationResult && (
                  <div className="border-t pt-4 bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Gerado com Sucesso!
                    </div>
                    <div className="text-sm space-y-1 text-green-700">
                      <div>
                        <strong>Empresa:</strong> {generationResult.nome_empresa}
                      </div>
                      <div>
                        <strong>Demanda:</strong>{" "}
                        {generationResult.demanda_contratada_kw} kW
                      </div>
                      <div>
                        <strong>Máxima:</strong>{" "}
                        {generationResult.potencia_maxima_kw} kW
                      </div>
                      <div>
                        <strong>Média:</strong>{" "}
                        {generationResult.potencia_media_kw} kW
                      </div>
                    </div>
                    <Button
                      onClick={handleDownloadFile}
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Dica:</strong> Use casos de teste para validar sua
                    análise de BESS antes de aplicar em dados reais. Cada
                    geração cria uma empresa e curva de carga aleatórias.
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
