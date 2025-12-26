/**
 * PÁGINA: Home (Landing Page)
 * 
 * Página inicial da aplicação com visão geral das funcionalidades
 * e links para as principais seções.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, TrendingDown, BarChart3, FileUp, Cpu } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">BESS Peak Shaving</h1>
              <p className="text-xs text-slate-600">Dimensionador</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium">
              Funcionalidades
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium">
              Como Funciona
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Dimensione seu Sistema BESS com Precisão
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Analise curvas de carga, simule diferentes cenários de armazenamento de energia e calcule o retorno sobre investimento de forma rápida e intuitiva.
            </p>
            <div className="flex gap-4">
              <Link href="/bess-analysis">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Começar Análise
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/test-case-generator">
                <Button size="lg" variant="outline">
                  Gerar Caso de Teste
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Zap className="w-24 h-24 text-blue-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-600 font-medium">Visualização de Curva de Carga</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Funcionalidades Principais</h3>
            <p className="text-lg text-slate-600">
              Tudo que você precisa para analisar e dimensionar sistemas BESS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileUp className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Upload de Dados</CardTitle>
                <CardDescription>
                  Importe arquivos Excel com dados de qualímetro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Suporta formato Elspec com timestamps e potência ativa em kW
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Análise de Curva</CardTitle>
                <CardDescription>
                  Visualize e analise perfil de consumo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Identifique picos de demanda e oportunidades de economia
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Simulação BESS</CardTitle>
                <CardDescription>
                  Simule diferentes cenários de armazenamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Calcule potência, capacidade e impacto na demanda contratada
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle>Análise Financeira</CardTitle>
                <CardDescription>
                  Calcule economia e payback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Estime ROI baseado em redução de demanda e diferença tarifária
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Casos de Teste</CardTitle>
                <CardDescription>
                  Gere dados realistas para testes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Crie curvas de carga industriais com diferentes severidades
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Exporte análises e recomendações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Gere relatórios com gráficos comparativos e especificações técnicas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Como Funciona</h3>
          <p className="text-lg text-slate-600">
            Siga estes passos para dimensionar seu sistema BESS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: "Importe Dados", desc: "Upload do arquivo Excel com curva de carga" },
            { step: 2, title: "Configure Tarifa", desc: "Defina horários e preços de energia" },
            { step: 3, title: "Simule BESS", desc: "Teste diferentes capacidades e potências" },
            { step: 4, title: "Analise ROI", desc: "Veja economia anual e payback" },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {item.step}
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.desc}</p>
              {item.step < 4 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-blue-200 -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-lg mb-8 opacity-90">
            Gere um caso de teste e explore todas as funcionalidades da plataforma
          </p>
          <Link href="/test-case-generator">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              Gerar Caso de Teste Agora
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>© 2025 BESS Peak Shaving Dimensioner. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Desenvolvido com precisão para análises de sistemas de armazenamento de energia</p>
        </div>
      </footer>
    </div>
  );
}
