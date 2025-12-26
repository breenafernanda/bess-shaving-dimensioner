/**
 * PÁGINA: Análise BESS
 * 
 * Página principal para upload, análise e simulação de BESS.
 * Fluxo: Upload → Análise → Configuração Tarifária → Dimensionamento → Simulação
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, BarChart3, Settings, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import UploadComponent from "@/components/bess/UploadComponent";
import CurvaCarregaComponent from "@/components/bess/CurvaCarregaComponent";
import ConfiguradorTarifa from "@/components/bess/ConfiguradorTarifa";
import DimensionadorComponent from "@/components/bess/DimensionadorComponent";
import SimuladorComponent from "@/components/bess/SimuladorComponent";

/**
 * Estados da análise
 */
type AnalysisStep = "upload" | "analise" | "tarifa" | "dimensionamento" | "simulacao";

interface AnalysisData {
  // Dados do upload
  uploadFile: File | null;
  uploadData: any;
  
  // Dados da análise
  analysisResult: any;
  
  // Configuração tarifária
  tariffConfig: {
    tarifa_ponta: number;
    tarifa_intermediaria: number;
    tarifa_fora_ponta: number;
    cobranca_demanda: number;
  };
  
  // Dimensionamento
  dimensionamento: any;
  
  // Simulação
  simulacao: any;
}

export default function BessAnalysis() {
  // =========================================================================
  // ESTADO
  // =========================================================================

  const [currentStep, setCurrentStep] = useState<AnalysisStep>("upload");
  const [isLoading, setIsLoading] = useState(false);
  
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    uploadFile: null,
    uploadData: null,
    analysisResult: null,
    tariffConfig: {
      tarifa_ponta: 1.71,
      tarifa_intermediaria: 1.12,
      tarifa_fora_ponta: 0.72,
      cobranca_demanda: 50,
    },
    dimensionamento: null,
    simulacao: null,
  });

  // =========================================================================
  // HANDLERS
  // =========================================================================

  /**
   * Processa upload de arquivo
   */
  const handleUploadComplete = async (file: File, data: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      uploadFile: file,
      uploadData: data,
    }));
    
    // Ir para análise
    setCurrentStep("analise");
    toast.success("Arquivo carregado com sucesso!");
  };

  /**
   * Processa análise de curva
   */
  const handleAnalysisComplete = (result: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      analysisResult: result,
    }));
    
    setCurrentStep("tarifa");
    toast.success("Análise concluída!");
  };

  /**
   * Atualiza configuração tarifária
   */
  const handleTariffUpdate = (config: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      tariffConfig: config,
    }));
  };

  /**
   * Processa dimensionamento
   */
  const handleDimensionamentoComplete = (result: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      dimensionamento: result,
    }));
    
    setCurrentStep("simulacao");
    toast.success("Dimensionamento concluído!");
  };

  /**
   * Processa simulação
   */
  const handleSimulacaoComplete = (result: any) => {
    setAnalysisData((prev) => ({
      ...prev,
      simulacao: result,
    }));
    
    toast.success("Simulação concluída!");
  };

  /**
   * Reseta análise
   */
  const handleReset = () => {
    setAnalysisData({
      uploadFile: null,
      uploadData: null,
      analysisResult: null,
      tariffConfig: {
        tarifa_ponta: 1.71,
        tarifa_intermediaria: 1.12,
        tarifa_fora_ponta: 0.72,
        cobranca_demanda: 50,
      },
      dimensionamento: null,
      simulacao: null,
    });
    setCurrentStep("upload");
  };

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Análise de BESS
          </h1>
          <p className="text-lg text-slate-600">
            Upload, análise e simulação de sistema de armazenamento de energia
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { id: "upload", label: "Upload", icon: Upload },
              { id: "analise", label: "Análise", icon: BarChart3 },
              { id: "tarifa", label: "Tarifa", icon: Settings },
              { id: "dimensionamento", label: "Dimensionamento", icon: Zap },
              { id: "simulacao", label: "Simulação", icon: TrendingUp },
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = 
                (step.id === "upload" && analysisData.uploadData) ||
                (step.id === "analise" && analysisData.analysisResult) ||
                (step.id === "tarifa" && analysisData.tariffConfig) ||
                (step.id === "dimensionamento" && analysisData.dimensionamento) ||
                (step.id === "simulacao" && analysisData.simulacao);

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id as AnalysisStep)}
                    disabled={!isCompleted && step.id !== "upload"}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {step.label}
                    </span>
                  </button>

                  {index < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-6">
          {/* Upload */}
          {currentStep === "upload" && (
            <UploadComponent onComplete={handleUploadComplete} />
          )}

          {/* Análise */}
          {currentStep === "analise" && analysisData.uploadData && (
            <CurvaCarregaComponent
              uploadData={analysisData.uploadData}
              onComplete={handleAnalysisComplete}
            />
          )}

          {/* Tarifa */}
          {currentStep === "tarifa" && analysisData.analysisResult && (
            <ConfiguradorTarifa
              currentConfig={analysisData.tariffConfig}
              analysisResult={analysisData.analysisResult}
              onUpdate={handleTariffUpdate}
              onNext={() => setCurrentStep("dimensionamento")}
            />
          )}

          {/* Dimensionamento */}
          {currentStep === "dimensionamento" && analysisData.analysisResult && (
            <DimensionadorComponent
              uploadData={analysisData.uploadData}
              analysisResult={analysisData.analysisResult}
              tariffConfig={analysisData.tariffConfig}
              onComplete={handleDimensionamentoComplete}
            />
          )}

          {/* Simulação */}
          {currentStep === "simulacao" && analysisData.dimensionamento && (
            <SimuladorComponent
              uploadData={analysisData.uploadData}
              dimensionamento={analysisData.dimensionamento}
              tariffConfig={analysisData.tariffConfig}
              onComplete={handleSimulacaoComplete}
            />
          )}

          {/* Resultado Final */}
          {analysisData.simulacao && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">
                  ✅ Análise Completa!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-green-700">Potência BESS</div>
                    <div className="text-2xl font-bold text-green-900">
                      {analysisData.dimensionamento?.dimensionamento?.potencia_bess_kw} kW
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-700">Capacidade BESS</div>
                    <div className="text-2xl font-bold text-green-900">
                      {analysisData.dimensionamento?.dimensionamento?.capacidade_bess_kwh} kWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-700">Economia Anual</div>
                    <div className="text-2xl font-bold text-green-900">
                      R$ {analysisData.dimensionamento?.economia?.economia_total_anual_reais?.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-green-700">Payback</div>
                    <div className="text-2xl font-bold text-green-900">
                      {analysisData.dimensionamento?.payback?.payback_anos} anos
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Nova Análise
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    Exportar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
