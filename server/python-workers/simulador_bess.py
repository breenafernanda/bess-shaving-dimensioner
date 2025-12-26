"""
MÓDULO: Simulador de BESS (Battery Energy Storage System)

Realiza simulação dia a dia de um sistema de armazenamento de energia,
calculando economia e payback baseado em estratégias de carregamento.

Estratégias suportadas:
- solar: Carrega com geração própria durante o dia
- grid-offpeak: Carrega na madrugada com tarifa baixa
"""

import json
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import random


class SimuladorBESS:
    """
    Simulador de BESS com análise financeira.
    """
    
    def __init__(
        self,
        potencias_kw: List[float],
        timestamps: List[str],
        capacidade_bess_kwh: float,
        potencia_bess_kw: float,
        estrategia_carregamento: str,
        tarifa_ponta_reais_kwh: float,
        tarifa_intermediaria_reais_kwh: float,
        tarifa_fora_ponta_reais_kwh: float,
        cobranca_demanda_reais_kw_mes: float = 0,
        multa_ultrapassagem_percent: float = 20,
        horario_ponta_inicio: int = 18,
        horario_ponta_fim: int = 21,
        horario_intermediaria_inicio: int = 17,
        horario_intermediaria_fim: int = 22,
    ):
        """
        Inicializa o simulador.
        
        Args:
            potencias_kw: Lista de potências em kW
            timestamps: Lista de timestamps ISO
            capacidade_bess_kwh: Capacidade do BESS em kWh
            potencia_bess_kw: Potência do BESS em kW
            estrategia_carregamento: 'solar' ou 'grid-offpeak'
            tarifa_ponta_reais_kwh: Preço na ponta (R$/kWh)
            tarifa_intermediaria_reais_kwh: Preço intermediário (R$/kWh)
            tarifa_fora_ponta_reais_kwh: Preço fora de ponta (R$/kWh)
            cobranca_demanda_reais_kw_mes: Cobrança de demanda (R$/kW/mês)
            multa_ultrapassagem_percent: Multa por ultrapassagem (%)
            horario_ponta_inicio: Hora de início da ponta
            horario_ponta_fim: Hora de término da ponta
            horario_intermediaria_inicio: Hora de início da intermediária
            horario_intermediaria_fim: Hora de término da intermediária
        """
        self.potencias_kw = potencias_kw
        self.timestamps = [datetime.fromisoformat(ts) for ts in timestamps]
        self.capacidade_bess_kwh = capacidade_bess_kwh
        self.potencia_bess_kw = potencia_bess_kw
        self.estrategia = estrategia_carregamento
        self.tarifa_ponta = tarifa_ponta_reais_kwh
        self.tarifa_intermediaria = tarifa_intermediaria_reais_kwh
        self.tarifa_fora_ponta = tarifa_fora_ponta_reais_kwh
        self.cobranca_demanda = cobranca_demanda_reais_kw_mes
        self.multa_ultrapassagem = multa_ultrapassagem_percent
        self.hp_inicio = horario_ponta_inicio
        self.hp_fim = horario_ponta_fim
        self.hi_inicio = horario_intermediaria_inicio
        self.hi_fim = horario_intermediaria_fim
        
        # Calcular demanda contratada (máxima do período)
        self.demanda_contratada = max(potencias_kw)
        
    def obter_tarifa(self, timestamp: datetime) -> float:
        """
        Obtém a tarifa para um horário específico.
        """
        hora = timestamp.hour
        dia_semana = timestamp.weekday()
        
        # Ponta: seg-sex, 18-21h
        if dia_semana < 5 and self.hp_inicio <= hora < self.hp_fim:
            return self.tarifa_ponta
        
        # Intermediária: seg-sex, 17-22h (exceto ponta)
        if dia_semana < 5 and self.hi_inicio <= hora < self.hi_fim:
            return self.tarifa_intermediaria
        
        # Fora de ponta
        return self.tarifa_fora_ponta
    
    def obter_geracao_solar(self, timestamp: datetime) -> float:
        """
        Estima geração solar para um horário.
        
        Padrão simplificado:
        - 6-18h: Gera conforme curva solar
        - Resto: Não gera
        """
        hora = timestamp.hour
        
        if 6 <= hora < 18:
            # Curva solar simplificada (gaussiana)
            # Pico ao meio-dia
            pico_hora = 12
            sigma = 3
            import math
            geracao = math.exp(-((hora - pico_hora) ** 2) / (2 * sigma ** 2))
            return geracao * 0.8  # 80% da potência máxima
        
        return 0
    
    def simular_dia(
        self,
        data: datetime,
        potencias_dia: List[float],
        soc_inicial_percent: float = 50
    ) -> Dict:
        """
        Simula um dia completo.
        
        Args:
            data: Data do dia
            potencias_dia: Potências para as 24 horas do dia
            soc_inicial_percent: Estado de carga inicial (%)
            
        Returns:
            Dict com resultados do dia
        """
        # Inicializar estado
        soc_atual = (soc_inicial_percent / 100) * self.capacidade_bess_kwh
        
        # Demanda máxima do dia
        demanda_max_original = max(potencias_dia)
        
        # Listas para rastreamento
        socs = [soc_atual]
        potencias_com_bess = []
        descargas = []
        cargas = []
        custos_carga = []
        economias_descarga = []
        
        # Simular cada hora
        for hora, potencia_original in enumerate(potencias_dia):
            timestamp = data.replace(hour=hora)
            tarifa = self.obter_tarifa(timestamp)
            
            # Decisão de carregamento/descarregamento
            if self.estrategia == "solar":
                geracao_solar = self.obter_geracao_solar(timestamp)
                energia_disponivel = geracao_solar * self.potencia_bess_kw
                
                # Carregar se houver geração e espaço
                if energia_disponivel > 0 and soc_atual < self.capacidade_bess_kwh:
                    energia_carga = min(
                        energia_disponivel,
                        self.capacidade_bess_kwh - soc_atual
                    )
                    soc_atual += energia_carga
                    cargas.append(energia_carga)
                    custos_carga.append(0)  # Solar é grátis
                else:
                    cargas.append(0)
                    custos_carga.append(0)
            
            elif self.estrategia == "grid-offpeak":
                # Carregar na madrugada (00-06h) com tarifa baixa
                if 0 <= hora < 6 and soc_atual < self.capacidade_bess_kwh:
                    energia_carga = min(
                        self.potencia_bess_kw,
                        self.capacidade_bess_kwh - soc_atual
                    )
                    soc_atual += energia_carga
                    cargas.append(energia_carga)
                    custos_carga.append(energia_carga * tarifa)
                else:
                    cargas.append(0)
                    custos_carga.append(0)
            
            # Decisão de descarregamento (durante ponta)
            hora_ponta = self.hp_inicio <= hora < self.hp_fim
            
            if hora_ponta and soc_atual > 0:
                # Descarregar para reduzir pico
                energia_descarga = min(
                    self.potencia_bess_kw,
                    soc_atual,
                    max(0, potencia_original - (self.demanda_contratada * 0.7))
                )
                
                if energia_descarga > 0:
                    soc_atual -= energia_descarga
                    potencia_com_bess = potencia_original - energia_descarga
                    descargas.append(energia_descarga)
                    economias_descarga.append(energia_descarga * tarifa)
                else:
                    descargas.append(0)
                    economias_descarga.append(0)
                    potencia_com_bess = potencia_original
            else:
                descargas.append(0)
                economias_descarga.append(0)
                potencia_com_bess = potencia_original
            
            potencias_com_bess.append(potencia_com_bess)
            socs.append(soc_atual)
        
        # Calcular resultados do dia
        demanda_max_com_bess = max(potencias_com_bess)
        reducao_demanda = demanda_max_original - demanda_max_com_bess
        
        # Custos e economias
        custo_carregamento = sum(custos_carga)
        economia_descarga = sum(economias_descarga)
        economia_liquida = economia_descarga - custo_carregamento
        
        return {
            "data": data.isoformat(),
            "demanda_max_original_kw": round(demanda_max_original, 2),
            "demanda_max_com_bess_kw": round(demanda_max_com_bess, 2),
            "reducao_demanda_kw": round(reducao_demanda, 2),
            "energia_carregada_kwh": round(sum(cargas), 2),
            "energia_descarregada_kwh": round(sum(descargas), 2),
            "custo_carregamento_reais": round(custo_carregamento, 2),
            "economia_descarga_reais": round(economia_descarga, 2),
            "economia_liquida_reais": round(economia_liquida, 2),
            "soc_inicial_percent": round((socs[0] / self.capacidade_bess_kwh) * 100, 1),
            "soc_final_percent": round((socs[-1] / self.capacidade_bess_kwh) * 100, 1),
            "potencias_original": [round(p, 1) for p in potencias_dia],
            "potencias_com_bess": [round(p, 1) for p in potencias_com_bess],
            "socs": [round((s / self.capacidade_bess_kwh) * 100, 1) for s in socs],
        }
    
    def simular_periodo_completo(self) -> Dict:
        """
        Simula o período completo.
        
        Returns:
            Dict com resultados completos
        """
        # Agrupar por dia
        dias_dados = {}
        for ts, potencia in zip(self.timestamps, self.potencias_kw):
            data = ts.date()
            if data not in dias_dados:
                dias_dados[data] = []
            dias_dados[data].append(potencia)
        
        # Simular cada dia
        resultados_diarios = []
        soc_atual = 50  # Começar com 50%
        
        for data_obj in sorted(dias_dados.keys()):
            potencias_dia = dias_dados[data_obj]
            
            # Completar com zeros se necessário
            while len(potencias_dia) < 24:
                potencias_dia.append(0)
            
            resultado_dia = self.simular_dia(
                datetime.combine(data_obj, datetime.min.time()),
                potencias_dia[:24],
                soc_inicial_percent=soc_atual
            )
            
            resultados_diarios.append(resultado_dia)
            soc_atual = resultado_dia["soc_final_percent"]
        
        # Calcular totais
        economia_total = sum(r["economia_liquida_reais"] for r in resultados_diarios)
        reducao_demanda_media = sum(r["reducao_demanda_kw"] for r in resultados_diarios) / len(resultados_diarios)
        
        # Calcular economia anual
        dias_simulados = len(resultados_diarios)
        dias_ano = 365
        economia_anual = economia_total * (dias_ano / dias_simulados)
        
        # Redução de demanda contratada
        reducao_demanda_contratada = reducao_demanda_media
        economia_demanda_anual = reducao_demanda_contratada * self.cobranca_demanda * 12
        
        # Economia total anual
        economia_total_anual = economia_anual + economia_demanda_anual
        
        return {
            "sucesso": True,
            "resumo": {
                "dias_simulados": dias_simulados,
                "economia_total_periodo_reais": round(economia_total, 2),
                "economia_anual_estimada_reais": round(economia_total_anual, 2),
                "reducao_demanda_media_kw": round(reducao_demanda_media, 2),
                "reducao_demanda_contratada_kw": round(reducao_demanda_contratada, 2),
                "economia_demanda_anual_reais": round(economia_demanda_anual, 2),
            },
            "resultados_diarios": resultados_diarios,
        }


def simular_bess(
    potencias_kw: List[float],
    timestamps: List[str],
    capacidade_bess_kwh: float,
    potencia_bess_kw: float,
    estrategia_carregamento: str,
    tarifa_ponta: float,
    tarifa_intermediaria: float,
    tarifa_fora_ponta: float,
    cobranca_demanda: float = 0,
    multa_ultrapassagem: float = 20,
) -> Dict:
    """
    Função wrapper para simular BESS.
    """
    try:
        simulador = SimuladorBESS(
            potencias_kw=potencias_kw,
            timestamps=timestamps,
            capacidade_bess_kwh=capacidade_bess_kwh,
            potencia_bess_kw=potencia_bess_kw,
            estrategia_carregamento=estrategia_carregamento,
            tarifa_ponta_reais_kwh=tarifa_ponta,
            tarifa_intermediaria_reais_kwh=tarifa_intermediaria,
            tarifa_fora_ponta_reais_kwh=tarifa_fora_ponta,
            cobranca_demanda_reais_kw_mes=cobranca_demanda,
            multa_ultrapassagem_percent=multa_ultrapassagem,
        )
        
        return simulador.simular_periodo_completo()
        
    except Exception as e:
        return {
            "sucesso": False,
            "erro": str(e)
        }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Simulador de BESS")
    parser.add_argument("--capacity", type=float, required=True, help="Capacidade BESS (kWh)")
    parser.add_argument("--power", type=float, required=True, help="Potência BESS (kW)")
    parser.add_argument("--strategy", required=True, choices=["solar", "grid-offpeak"])
    
    args = parser.parse_args()
    
    # Exemplo com dados fictícios
    potencias = [100 + 50 * (i % 24) for i in range(240)]
    timestamps = [
        (datetime.now() - timedelta(days=10) + timedelta(hours=i)).isoformat()
        for i in range(240)
    ]
    
    resultado = simular_bess(
        potencias_kw=potencias,
        timestamps=timestamps,
        capacidade_bess_kwh=args.capacity,
        potencia_bess_kw=args.power,
        estrategia_carregamento=args.strategy,
        tarifa_ponta=1.71,
        tarifa_intermediaria=1.12,
        tarifa_fora_ponta=0.72,
        cobranca_demanda=50,
    )
    
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
