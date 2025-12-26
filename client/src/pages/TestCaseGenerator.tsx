/**
 * PÁGINA: Gerador de Casos de Teste
 * 
 * Permite criar arquivos Excel realistas com curvas de carga industriais
 * para simular diferentes cenários de empresas.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
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
  // Estado
  const [selectedStage, setSelectedStage] = useState<number>(3);
  const [selectedSeverity, setSelectedSeverity] = useState<"leve" | "moderado" | "grave">("moderado");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [generationResult, setGenerationResult] = useState<any>(null);

  // Hook de mutation tRPC
  const generateMutation = trpc.bess.generateTestCase.useMutation({
    onSuccess: (data) => {
      if (data.sucesso) {
        setGenerationResult(data.dados);
        toast.success("Caso de teste gerado com sucesso!");
      } else {
        toast.error(data.erro || "Erro ao gerar caso de teste");
      }
    },
    onError: (error) => {
      console.error("Erro:", error);
      toast.error(error.message || "Erro ao gerar caso de teste");
    },
  });

  /**
   * Gera um novo caso de teste usando tRPC
   */
  const handleGenerateTestCase = async () => {
    setGenerationResult(null);
    generateMutation.mutate({
      stage: selectedStage,
      severity: selectedSeverity,
      days: selectedPeriod,
    });
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

  // Configurações selecionadas
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
                    onValueChange={(value) => setSelectedPeriod(value[0])}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PERIOD_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => setSelectedPeriod(option.value)}
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

          {/* Resumo e Resultado */}
          <div className="space-y-6">
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
                    {selectedPeriod} dias
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultado */}
            {generationResult && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Caso Gerado com Sucesso!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-green-700 mb-1">Nome da Empresa</div>
                    <div className="font-semibold text-green-900">
                      {generationResult.nome_empresa}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-green-700 mb-1">Demanda Contratada</div>
                    <div className="font-semibold text-green-900">
                      {generationResult.demanda_contratada_kw} kW
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-green-700 mb-1">Potência Máxima</div>
                    <div className="font-semibold text-green-900">
                      {generationResult.potencia_maxima_kw} kW
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-green-700 mb-1">Pontos de Dados</div>
                    <div className="font-semibold text-green-900">
                      {generationResult.total_pontos}
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadFile}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    O arquivo gerado segue o formato Elspec e pode ser importado
                    diretamente na análise de BESS.
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
