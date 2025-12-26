/**
 * COMPONENTE: Upload de Arquivo Excel
 * 
 * Permite upload de arquivo Excel no formato Elspec
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface UploadComponentProps {
  onComplete: (file: File, data: any) => void;
}

export default function UploadComponent({ onComplete }: UploadComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /**
   * Processa arquivo selecionado
   */
  const handleFileSelect = async (file: File) => {
    // Validar tipo de arquivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Por favor, selecione um arquivo Excel (.xlsx ou .xls)");
      return;
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);

    try {
      // Criar FormData
      const formData = new FormData();
      formData.append("file", file);

      // Enviar para backend
      const response = await fetch("/api/trpc/bess.uploadAndAnalyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const result = await response.json();

      if (!result.sucesso) {
        throw new Error(result.erro || "Erro ao processar arquivo");
      }

      // Chamar callback
      onComplete(file, result.dados);
      toast.success("Arquivo processado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao processar arquivo");
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handler para drag and drop
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  /**
   * Handler para input de arquivo
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="w-5 h-5" />
          Upload de Arquivo Excel
        </CardTitle>
        <CardDescription>
          Selecione um arquivo Excel no formato Elspec com dados de qualímetro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            O arquivo deve conter timestamps na coluna A e potência ativa (kW) na coluna B.
            Formato esperado: DD/MM/YYYY HH:MM:SS.000000
          </AlertDescription>
        </Alert>

        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-slate-400"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-slate-400" />
            <div>
              <p className="font-semibold text-slate-900">
                Arraste um arquivo aqui ou clique para selecionar
              </p>
              <p className="text-sm text-slate-600 mt-1">
                Formatos suportados: .xlsx, .xls (máximo 10MB)
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              disabled={isLoading}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button
                asChild
                disabled={isLoading}
                className="mt-4 cursor-pointer"
              >
                <span>
                  {isLoading ? "Processando..." : "Selecionar Arquivo"}
                </span>
              </Button>
            </label>
          </div>
        </div>

        {/* Arquivo Selecionado */}
        {selectedFile && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">{selectedFile.name}</p>
              <p className="text-sm text-green-700">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        )}

        {/* Exemplo */}
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="font-semibold text-slate-900 mb-2">Exemplo de formato:</p>
          <div className="text-sm text-slate-600 font-mono space-y-1">
            <div>Time stamp | [kW] Active Power Total</div>
            <div>26/12/2025 00:00:00.000000 | 150.5</div>
            <div>26/12/2025 01:00:00.000000 | 148.2</div>
            <div>26/12/2025 02:00:00.000000 | 145.8</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
