"""
MÓDULO: Parser de Excel (Formato Elspec)

Extrai dados de qualímetro em formato Elspec e converte para estrutura
utilizada pela aplicação.

Formato esperado:
- Coluna A: Timestamps (DD/MM/YYYY HH:MM:SS.000000)
- Coluna B: Potência ativa em kW
"""

import json
from datetime import datetime
from typing import List, Dict, Tuple
from pathlib import Path
import pandas as pd


def parsear_arquivo_excel(caminho_arquivo: str) -> Dict:
    """
    Faz parse de arquivo Excel no formato Elspec.
    
    Args:
        caminho_arquivo: Caminho para o arquivo Excel
        
    Returns:
        Dict com dados parseados e metadados
    """
    try:
        # Validar arquivo
        if not Path(caminho_arquivo).exists():
            return {
                "sucesso": False,
                "erro": f"Arquivo não encontrado: {caminho_arquivo}"
            }
        
        # Ler arquivo Excel
        df = pd.read_excel(caminho_arquivo, sheet_name=0)
        
        # Validar colunas
        if len(df.columns) < 2:
            return {
                "sucesso": False,
                "erro": "Arquivo deve ter pelo menos 2 colunas"
            }
        
        # Extrair colunas
        col_timestamp = df.iloc[:, 0]
        col_potencia = df.iloc[:, 1]
        
        # Converter para listas
        timestamps = []
        potencias = []
        erros = []
        
        for idx, (ts_str, pw) in enumerate(zip(col_timestamp, col_potencia)):
            try:
                # Skip header se necessário
                if idx == 0 and isinstance(ts_str, str) and "Time" in ts_str:
                    continue
                
                # Parsear timestamp
                if isinstance(ts_str, str):
                    # Formato: DD/MM/YYYY HH:MM:SS.000000
                    ts = datetime.strptime(ts_str.split('.')[0], "%d/%m/%Y %H:%M:%S")
                else:
                    # Pandas datetime
                    ts = pd.Timestamp(ts_str).to_pydatetime()
                
                # Converter potência para float
                potencia_kw = float(pw)
                
                timestamps.append(ts)
                potencias.append(potencia_kw)
                
            except Exception as e:
                erros.append({
                    "linha": idx + 1,
                    "erro": str(e)
                })
        
        # Validar dados
        if not timestamps or not potencias:
            return {
                "sucesso": False,
                "erro": "Nenhum dado válido encontrado no arquivo"
            }
        
        # Calcular metadados
        data_inicio = min(timestamps)
        data_fim = max(timestamps)
        dias = (data_fim - data_inicio).days + 1
        
        potencia_max = max(potencias)
        potencia_min = min(potencias)
        potencia_media = sum(potencias) / len(potencias)
        
        # Retornar resultado
        return {
            "sucesso": True,
            "dados": {
                "timestamps": [ts.isoformat() for ts in timestamps],
                "potencias": potencias,
                "data_inicio": data_inicio.isoformat(),
                "data_fim": data_fim.isoformat(),
                "total_dias": dias,
                "total_pontos": len(potencias),
                "potencia_maxima_kw": round(potencia_max, 2),
                "potencia_minima_kw": round(potencia_min, 2),
                "potencia_media_kw": round(potencia_media, 2),
            },
            "avisos": erros if erros else None
        }
        
    except Exception as e:
        return {
            "sucesso": False,
            "erro": f"Erro ao processar arquivo: {str(e)}"
        }


def analisar_curva_carga(potencias: List[float], timestamps: List[str]) -> Dict:
    """
    Analisa a curva de carga e identifica características principais.
    
    Args:
        potencias: Lista de potências em kW
        timestamps: Lista de timestamps ISO
        
    Returns:
        Dict com análise da curva
    """
    try:
        # Converter timestamps
        datas = [datetime.fromisoformat(ts) for ts in timestamps]
        
        # Agrupar por hora do dia
        consumo_por_hora = {}
        for hora in range(24):
            consumo_por_hora[hora] = []
        
        for data, potencia in zip(datas, potencias):
            hora = data.hour
            consumo_por_hora[hora].append(potencia)
        
        # Calcular média por hora
        media_por_hora = {}
        for hora, consumos in consumo_por_hora.items():
            if consumos:
                media_por_hora[hora] = round(sum(consumos) / len(consumos), 2)
            else:
                media_por_hora[hora] = 0
        
        # Identificar picos
        potencia_max = max(potencias)
        potencia_min = min(potencias)
        potencia_media = sum(potencias) / len(potencias)
        
        # Identificar horários de pico (acima de 90% do máximo)
        threshold_pico = potencia_max * 0.90
        horas_pico = [h for h, p in media_por_hora.items() if p >= threshold_pico]
        
        # Identificar horários de vale (abaixo de 50% do máximo)
        threshold_vale = potencia_max * 0.50
        horas_vale = [h for h, p in media_por_hora.items() if p <= threshold_vale]
        
        return {
            "sucesso": True,
            "analise": {
                "potencia_maxima": round(potencia_max, 2),
                "potencia_minima": round(potencia_min, 2),
                "potencia_media": round(potencia_media, 2),
                "fator_variacao": round((potencia_max - potencia_min) / potencia_media, 2),
                "media_por_hora": media_por_hora,
                "horas_pico": sorted(horas_pico),
                "horas_vale": sorted(horas_vale),
                "potencial_peak_shaving_kw": round(potencia_max - potencia_media, 2),
            }
        }
        
    except Exception as e:
        return {
            "sucesso": False,
            "erro": f"Erro ao analisar curva: {str(e)}"
        }


def classificar_por_horario(
    potencias: List[float],
    timestamps: List[str],
    horarios_ponta: Tuple[int, int] = (18, 21),
    horarios_intermediaria: Tuple[int, int] = (17, 22)
) -> Dict:
    """
    Classifica o consumo por horário tarifário.
    
    Args:
        potencias: Lista de potências em kW
        timestamps: Lista de timestamps ISO
        horarios_ponta: Tupla (hora_inicio, hora_fim) da ponta
        horarios_intermediaria: Tupla (hora_inicio, hora_fim) da intermediária
        
    Returns:
        Dict com classificação
    """
    try:
        datas = [datetime.fromisoformat(ts) for ts in timestamps]
        
        consumo_ponta = []
        consumo_intermediaria = []
        consumo_fora_ponta = []
        
        for data, potencia in zip(datas, potencias):
            hora = data.hour
            dia_semana = data.weekday()  # 0=seg, 4=sex, 5=sab, 6=dom
            
            # Ponta: seg-sex, 18-21h
            if dia_semana < 5 and horarios_ponta[0] <= hora < horarios_ponta[1]:
                consumo_ponta.append(potencia)
            # Intermediária: seg-sex, 17-22h (exceto ponta)
            elif dia_semana < 5 and horarios_intermediaria[0] <= hora < horarios_intermediaria[1]:
                consumo_intermediaria.append(potencia)
            # Fora de ponta: resto
            else:
                consumo_fora_ponta.append(potencia)
        
        # Calcular estatísticas
        def calc_stats(lista):
            if not lista:
                return {"total": 0, "media": 0, "max": 0, "min": 0}
            return {
                "total": round(sum(lista), 2),
                "media": round(sum(lista) / len(lista), 2),
                "max": round(max(lista), 2),
                "min": round(min(lista), 2),
                "pontos": len(lista)
            }
        
        return {
            "sucesso": True,
            "classificacao": {
                "ponta": calc_stats(consumo_ponta),
                "intermediaria": calc_stats(consumo_intermediaria),
                "fora_ponta": calc_stats(consumo_fora_ponta),
                "total_pontos": len(potencias),
            }
        }
        
    except Exception as e:
        return {
            "sucesso": False,
            "erro": f"Erro ao classificar: {str(e)}"
        }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Parser de arquivo Excel Elspec")
    parser.add_argument("--file", required=True, help="Caminho do arquivo Excel")
    parser.add_argument("--analyze", action="store_true", help="Realizar análise completa")
    
    args = parser.parse_args()
    
    # Parsear arquivo
    resultado = parsear_arquivo_excel(args.file)
    
    if resultado["sucesso"] and args.analyze:
        dados = resultado["dados"]
        
        # Análise de curva
        analise = analisar_curva_carga(dados["potencias"], dados["timestamps"])
        resultado["analise"] = analise.get("analise")
        
        # Classificação por horário
        classificacao = classificar_por_horario(dados["potencias"], dados["timestamps"])
        resultado["classificacao"] = classificacao.get("classificacao")
    
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
