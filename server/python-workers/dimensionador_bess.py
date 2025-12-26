"""
MÓDULO: Dimensionador de BESS

Calcula a potência (kW) e capacidade (kWh) necessárias para um sistema BESS
baseado na análise da curva de carga e objetivos de peak shaving.
"""

import json
from typing import List, Dict, Tuple
from datetime import datetime


class DimensionadorBESS:
    """
    Dimensiona sistema BESS baseado em análise de curva de carga.
    """
    
    def __init__(
        self,
        potencias_kw: List[float],
        timestamps: List[str],
        tarifa_ponta: float,
        tarifa_fora_ponta: float,
        cobranca_demanda: float,
        horario_ponta_inicio: int = 18,
        horario_ponta_fim: int = 21,
    ):
        """
        Inicializa o dimensionador.
        """
        self.potencias_kw = potencias_kw
        self.timestamps = [datetime.fromisoformat(ts) for ts in timestamps]
        self.tarifa_ponta = tarifa_ponta
        self.tarifa_fora_ponta = tarifa_fora_ponta
        self.cobranca_demanda = cobranca_demanda
        self.hp_inicio = horario_ponta_inicio
        self.hp_fim = horario_ponta_fim
        
        # Calcular demanda contratada
        self.demanda_contratada = max(potencias_kw)
        
    def extrair_picos_ponta(self) -> Tuple[List[float], float, float]:
        """
        Extrai os picos de demanda durante o horário de ponta.
        
        Returns:
            Tupla (picos, pico_máximo, pico_médio)
        """
        picos = []
        
        for ts, potencia in zip(self.timestamps, self.potencias_kw):
            hora = ts.hour
            dia_semana = ts.weekday()
            
            # Ponta: seg-sex, 18-21h
            if dia_semana < 5 and self.hp_inicio <= hora < self.hp_fim:
                picos.append(potencia)
        
        if not picos:
            return [], 0, 0
        
        pico_max = max(picos)
        pico_medio = sum(picos) / len(picos)
        
        return picos, pico_max, pico_medio
    
    def calcular_potencia_necessaria(
        self,
        reducao_demanda_percent: float = 20
    ) -> float:
        """
        Calcula a potência necessária do BESS.
        
        Args:
            reducao_demanda_percent: Percentual de redução desejado (%)
            
        Returns:
            Potência em kW
        """
        picos, pico_max, _ = self.extrair_picos_ponta()
        
        if not picos:
            return 0
        
        # Potência necessária para reduzir o pico em X%
        potencia_necessaria = pico_max * (reducao_demanda_percent / 100)
        
        return round(potencia_necessaria, 1)
    
    def calcular_capacidade_necessaria(
        self,
        potencia_bess_kw: float,
        ciclos_por_dia: int = 1
    ) -> float:
        """
        Calcula a capacidade necessária do BESS.
        
        Args:
            potencia_bess_kw: Potência do BESS (kW)
            ciclos_por_dia: Número de ciclos carga/descarga por dia
            
        Returns:
            Capacidade em kWh
        """
        picos, _, _ = self.extrair_picos_ponta()
        
        if not picos:
            return 0
        
        # Duração média da ponta (horas)
        duracao_ponta = (self.hp_fim - self.hp_inicio)
        
        # Energia necessária para descarregar durante a ponta
        energia_por_ciclo = potencia_bess_kw * duracao_ponta
        
        # Capacidade total considerando ciclos
        capacidade = energia_por_ciclo * ciclos_por_dia
        
        # Adicionar margem de segurança (20%)
        capacidade *= 1.2
        
        return round(capacidade, 1)
    
    def calcular_economia_anual(
        self,
        potencia_bess_kw: float,
        capacidade_bess_kwh: float,
        taxa_utilizacao: float = 0.8,
    ) -> Dict:
        """
        Calcula a economia anual estimada.
        
        Args:
            potencia_bess_kw: Potência do BESS (kW)
            capacidade_bess_kwh: Capacidade do BESS (kWh)
            taxa_utilizacao: Taxa de utilização do BESS (0-1)
            
        Returns:
            Dict com economia estimada
        """
        picos, pico_max, _ = self.extrair_picos_ponta()
        
        if not picos:
            return {"economia_anual": 0, "economia_demanda": 0, "economia_energia": 0}
        
        # Redução de demanda contratada
        reducao_demanda = potencia_bess_kw * taxa_utilizacao
        economia_demanda_mensal = reducao_demanda * self.cobranca_demanda
        economia_demanda_anual = economia_demanda_mensal * 12
        
        # Economia de energia
        # Assumir que o BESS descarrega durante a ponta
        duracao_ponta = (self.hp_fim - self.hp_inicio)
        energia_descargada_dia = potencia_bess_kw * duracao_ponta * taxa_utilizacao
        
        # Dias úteis por ano (seg-sex)
        dias_uteis_ano = 252
        
        # Energia total descargada na ponta
        energia_ponta_anual = energia_descargada_dia * dias_uteis_ano
        
        # Economia de energia na ponta
        economia_energia_ponta = energia_ponta_anual * self.tarifa_ponta
        
        # Custo de carregamento na madrugada (fora-ponta)
        custo_carregamento_anual = energia_ponta_anual * self.tarifa_fora_ponta
        
        # Economia líquida de energia
        economia_energia_liquida = economia_energia_ponta - custo_carregamento_anual
        
        # Economia total
        economia_total = economia_demanda_anual + economia_energia_liquida
        
        return {
            "economia_demanda_anual_reais": round(economia_demanda_anual, 2),
            "economia_energia_anual_reais": round(economia_energia_liquida, 2),
            "economia_total_anual_reais": round(economia_total, 2),
            "reducao_demanda_kw": round(reducao_demanda, 2),
            "energia_descargada_anual_kwh": round(energia_ponta_anual, 2),
        }
    
    def calcular_payback(
        self,
        custo_investimento_reais: float,
        economia_anual_reais: float,
    ) -> Dict:
        """
        Calcula payback e ROI.
        
        Args:
            custo_investimento_reais: Custo inicial (R$)
            economia_anual_reais: Economia anual (R$)
            
        Returns:
            Dict com payback e ROI
        """
        if economia_anual_reais <= 0:
            return {
                "payback_anos": float('inf'),
                "roi_percent": 0,
                "viavel": False
            }
        
        # Payback simples
        payback_anos = custo_investimento_reais / economia_anual_reais
        
        # ROI (10 anos de análise)
        anos_analise = 10
        economia_total_10anos = economia_anual_reais * anos_analise
        lucro = economia_total_10anos - custo_investimento_reais
        roi_percent = (lucro / custo_investimento_reais) * 100
        
        # Viabilidade
        viavel = payback_anos <= anos_analise
        
        return {
            "payback_anos": round(payback_anos, 1),
            "roi_10anos_percent": round(roi_percent, 1),
            "lucro_10anos_reais": round(lucro, 2),
            "viavel": viavel,
        }
    
    def dimensionar(
        self,
        reducao_demanda_percent: float = 20,
        custo_investimento_reais: float = 0,
    ) -> Dict:
        """
        Realiza dimensionamento completo.
        
        Args:
            reducao_demanda_percent: Redução de demanda desejada (%)
            custo_investimento_reais: Custo do investimento (R$)
            
        Returns:
            Dict com dimensionamento completo
        """
        try:
            # Calcular potência
            potencia_bess = self.calcular_potencia_necessaria(reducao_demanda_percent)
            
            if potencia_bess <= 0:
                return {
                    "sucesso": False,
                    "erro": "Não foi possível calcular potência necessária"
                }
            
            # Calcular capacidade
            capacidade_bess = self.calcular_capacidade_necessaria(potencia_bess)
            
            # Calcular economia
            economia = self.calcular_economia_anual(potencia_bess, capacidade_bess)
            
            # Calcular payback
            payback = self.calcular_payback(
                custo_investimento_reais,
                economia["economia_total_anual_reais"]
            )
            
            # Extrair picos
            picos, pico_max, pico_medio = self.extrair_picos_ponta()
            
            return {
                "sucesso": True,
                "dimensionamento": {
                    "potencia_bess_kw": potencia_bess,
                    "capacidade_bess_kwh": capacidade_bess,
                    "demanda_contratada_kw": round(self.demanda_contratada, 2),
                    "pico_demanda_ponta_kw": round(pico_max, 2),
                    "pico_medio_ponta_kw": round(pico_medio, 2),
                    "reducao_demanda_percent": reducao_demanda_percent,
                },
                "economia": economia,
                "payback": payback,
                "custo_investimento_reais": custo_investimento_reais,
                "custo_por_kwh": round(custo_investimento_reais / capacidade_bess, 2) if capacidade_bess > 0 else 0,
                "custo_por_kw": round(custo_investimento_reais / potencia_bess, 2) if potencia_bess > 0 else 0,
            }
            
        except Exception as e:
            return {
                "sucesso": False,
                "erro": str(e)
            }


def dimensionar_bess(
    potencias_kw: List[float],
    timestamps: List[str],
    tarifa_ponta: float,
    tarifa_fora_ponta: float,
    cobranca_demanda: float,
    reducao_demanda_percent: float = 20,
    custo_investimento_reais: float = 0,
) -> Dict:
    """
    Função wrapper para dimensionar BESS.
    """
    dimensionador = DimensionadorBESS(
        potencias_kw=potencias_kw,
        timestamps=timestamps,
        tarifa_ponta=tarifa_ponta,
        tarifa_fora_ponta=tarifa_fora_ponta,
        cobranca_demanda=cobranca_demanda,
    )
    
    return dimensionador.dimensionar(
        reducao_demanda_percent=reducao_demanda_percent,
        custo_investimento_reais=custo_investimento_reais,
    )


if __name__ == "__main__":
    import argparse
    from datetime import timedelta
    
    parser = argparse.ArgumentParser(description="Dimensionador de BESS")
    parser.add_argument("--reduction", type=float, default=20, help="Redução de demanda (%)")
    parser.add_argument("--cost", type=float, default=0, help="Custo do investimento (R$)")
    
    args = parser.parse_args()
    
    # Exemplo com dados fictícios
    potencias = [100 + 50 * (i % 24) for i in range(240)]
    timestamps = [
        (datetime.now() - timedelta(days=10) + timedelta(hours=i)).isoformat()
        for i in range(240)
    ]
    
    resultado = dimensionar_bess(
        potencias_kw=potencias,
        timestamps=timestamps,
        tarifa_ponta=1.71,
        tarifa_fora_ponta=0.72,
        cobranca_demanda=50,
        reducao_demanda_percent=args.reduction,
        custo_investimento_reais=args.cost,
    )
    
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
