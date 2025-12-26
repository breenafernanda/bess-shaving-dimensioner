#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
╔════════════════════════════════════════════════════════════════╗
║   BESS Peak Shaving Dimensioner - Menu Auxiliar               ║
║   Versão 1.5 - Bug Fix spawn Python                           ║
║   Script de menu para build e start da aplicação              ║
╚════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

# Cores ANSI para terminal
class Cores:
    """Definição de cores para output no terminal"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def limpar_tela():
    """Limpa a tela do terminal"""
    os.system('clear' if os.name == 'posix' else 'cls')


def exibir_header():
    """Exibe o header da aplicação"""
    limpar_tela()
    print(f"{Cores.BLUE}")
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║   BESS Peak Shaving Dimensioner - Menu Auxiliar               ║")
    print("║   Versão 1.5 - Bug Fix spawn Python                           ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    print(f"{Cores.RESET}")


def exibir_menu():
    """Exibe o menu de opções"""
    print()
    print(f"{Cores.YELLOW}Selecione uma opção:{Cores.RESET}")
    print()
    print(f"{Cores.GREEN}1){Cores.RESET} Build Repo (instala dependências)")
    print(f"{Cores.GREEN}2){Cores.RESET} Start App (inicia servidor de desenvolvimento)")
    print(f"{Cores.GREEN}3){Cores.RESET} Build & Start (build + start)")
    print(f"{Cores.GREEN}4){Cores.RESET} Ver Status do Projeto")
    print(f"{Cores.GREEN}5){Cores.RESET} Executar Testes")
    print(f"{Cores.GREEN}6){Cores.RESET} Instalar Node.js (abrir site)")
    print(f"{Cores.GREEN}7){Cores.RESET} Docker Build (montar imagem)")
    print(f"{Cores.GREEN}8){Cores.RESET} Docker Up (subir container BESS)")
    print(f"{Cores.RED}0){Cores.RESET} Sair")
    print()


def verificar_comando(comando):
    """Verifica se um comando está disponível no sistema"""
    try:
        subprocess.run([comando, "--version"], 
                      capture_output=True, 
                      check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def build_repo():
    """Executa o build do repositório"""
    exibir_header()
    print(f"{Cores.YELLOW}[BUILD] Iniciando build do repositório...{Cores.RESET}")
    print()
    
    # Verificar se pnpm está instalado
    if not verificar_comando("pnpm"):
        print(f"{Cores.RED}[ERRO] pnpm não está instalado!{Cores.RESET}")
        print("Por favor, instale pnpm: npm install -g pnpm")
        input("Pressione ENTER para voltar ao menu...")
        return False
    
    # Passo 1: Instalar dependências
    print(f"{Cores.BLUE}[1/3] Instalando dependências...{Cores.RESET}")
    resultado = subprocess.run(["pnpm", "install"])
    if resultado.returncode != 0:
        print(f"{Cores.RED}[ERRO] Falha ao instalar dependências!{Cores.RESET}")
        input("Pressione ENTER para voltar ao menu...")
        return False
    
    # Passo 2: Compilar TypeScript
    print()
    print(f"{Cores.BLUE}[2/3] Compilando TypeScript...{Cores.RESET}")
    resultado = subprocess.run(["pnpm", "check"])
    if resultado.returncode != 0:
        print(f"{Cores.YELLOW}[AVISO] Erros de TypeScript detectados!{Cores.RESET}")
    
    # Passo 3: Configurar banco de dados
    print()
    print(f"{Cores.BLUE}[3/3] Configurando banco de dados...{Cores.RESET}")
    resultado = subprocess.run(["pnpm", "db:push"])
    if resultado.returncode != 0:
        print(f"{Cores.YELLOW}[AVISO] Falha ao configurar banco de dados!{Cores.RESET}")
    
    print()
    print(f"{Cores.GREEN}[OK] Build concluído com sucesso!{Cores.RESET}")
    input("Pressione ENTER para voltar ao menu...")
    return True


def start_app():
    """Inicia o servidor de desenvolvimento"""
    exibir_header()
    print(f"{Cores.YELLOW}[START] Iniciando servidor de desenvolvimento...{Cores.RESET}")
    print()
    
    # Verificar se pnpm está instalado
    if not verificar_comando("pnpm"):
        print(f"{Cores.RED}[ERRO] pnpm não está instalado!{Cores.RESET}")
        print("Por favor, instale pnpm: npm install -g pnpm")
        input("Pressione ENTER para voltar ao menu...")
        return False
    
    # Verificar se node_modules existe
    if not Path("node_modules").exists():
        print(f"{Cores.YELLOW}[AVISO] node_modules não encontrado!{Cores.RESET}")
        print("Execute a opção 1 (Build Repo) primeiro.")
        input("Pressione ENTER para voltar ao menu...")
        return False
    
    print(f"{Cores.BLUE}Iniciando servidor...{Cores.RESET}")
    print(f"{Cores.BLUE}Acesse a aplicação em: http://localhost:3000{Cores.RESET}")
    print()
    print(f"{Cores.YELLOW}Pressione Ctrl+C para parar o servidor{Cores.RESET}")
    print()
    
    try:
        subprocess.run(["pnpm", "dev"])
    except KeyboardInterrupt:
        print()
        print(f"{Cores.YELLOW}Servidor parado.{Cores.RESET}")
        input("Pressione ENTER para voltar ao menu...")


def build_and_start():
    """Executa build e depois start"""
    if build_repo():
        start_app()


def show_status():
    """Exibe status do projeto"""
    exibir_header()
    print(f"{Cores.YELLOW}[STATUS] Informações do Projeto{Cores.RESET}")
    print()
    
    # Node.js
    print(f"{Cores.BLUE}Node.js:{Cores.RESET}")
    subprocess.run(["node", "--version"])
    print()
    
    # pnpm
    print(f"{Cores.BLUE}pnpm:{Cores.RESET}")
    if verificar_comando("pnpm"):
        subprocess.run(["pnpm", "--version"])
    else:
        print("Não instalado")
    print()
    
    # Python
    print(f"{Cores.BLUE}Python:{Cores.RESET}")
    subprocess.run(["python3", "--version"])
    print()
    
    # Git
    print(f"{Cores.BLUE}Git Status:{Cores.RESET}")
    subprocess.run(["git", "status", "--short"])
    print()
    
    # Dependências
    if Path("node_modules").exists():
        print(f"{Cores.GREEN}✓ Dependências instaladas{Cores.RESET}")
    else:
        print(f"{Cores.RED}✗ Dependências não instaladas{Cores.RESET}")
    print()
    
    input("Pressione ENTER para voltar ao menu...")


def run_tests():
    """Executa testes unitários"""
    exibir_header()
    print(f"{Cores.YELLOW}[TESTES] Executando testes unitários...{Cores.RESET}")
    print()
    
    if not verificar_comando("pnpm"):
        print(f"{Cores.RED}[ERRO] pnpm não está instalado!{Cores.RESET}")
        input("Pressione ENTER para voltar ao menu...")
        return
    
    subprocess.run(["pnpm", "test"])
    
    print()
    input("Pressione ENTER para voltar ao menu...")


def instalar_nodejs():
    """Abre o site oficial do Node.js para download"""
    exibir_header()
    print(f"{Cores.YELLOW}[NODE.JS] Abrindo site oficial para download...{Cores.RESET}")
    print()
    url = "https://nodejs.org/"
    try:
        if platform.system() == "Windows":
            os.startfile(url)
        elif platform.system() == "Darwin":
            subprocess.run(["open", url])
        else:
            subprocess.run(["xdg-open", url])
        print(f"{Cores.GREEN}Site aberto no navegador padrão.{Cores.RESET}")
    except Exception as e:
        print(f"{Cores.RED}[ERRO] Não foi possível abrir o navegador: {e}{Cores.RESET}")
    print()
    print("Após instalar o Node.js, feche e reabra o terminal para continuar.")
    input("Pressione ENTER para voltar ao menu...")


def docker_build():
    """Executa o build da imagem Docker"""
    exibir_header()
    print(f"{Cores.YELLOW}[DOCKER] Build da imagem...{Cores.RESET}")
    print()
    resultado = subprocess.run(["docker", "build", "-t", "bess:latest", "."])
    if resultado.returncode == 0:
        print(f"{Cores.GREEN}Imagem Docker 'bess:latest' criada com sucesso!{Cores.RESET}")
    else:
        print(f"{Cores.RED}[ERRO] Falha ao criar imagem Docker!{Cores.RESET}")
    input("Pressione ENTER para voltar ao menu...")


def docker_up():
    """Sobe o container BESS usando docker-compose"""
    exibir_header()
    print(f"{Cores.YELLOW}[DOCKER] Subindo container BESS...{Cores.RESET}")
    print()
    resultado = subprocess.run(["docker-compose", "up", "-d"])
    if resultado.returncode == 0:
        print(f"{Cores.GREEN}Container 'BESS' iniciado! Acesse em http://localhost:3000{Cores.RESET}")
    else:
        print(f"{Cores.RED}[ERRO] Falha ao subir o container!{Cores.RESET}")
    input("Pressione ENTER para voltar ao menu...")


def main():
    """Função principal - loop do menu"""
    while True:
        exibir_header()
        exibir_menu()
        
        try:
            escolha = input(f"{Cores.BOLD}Digite sua escolha: {Cores.RESET}").strip()
            
            if escolha == "1":
                build_repo()
            elif escolha == "2":
                start_app()
            elif escolha == "3":
                build_and_start()
            elif escolha == "4":
                show_status()
            elif escolha == "5":
                run_tests()
            elif escolha == "6":
                instalar_nodejs()
            elif escolha == "7":
                docker_build()
            elif escolha == "8":
                docker_up()
            elif escolha == "0":
                exibir_header()
                print(f"{Cores.GREEN}Até logo!{Cores.RESET}")
                print()
                sys.exit(0)
            else:
                print(f"{Cores.RED}Opção inválida!{Cores.RESET}")
                input("Pressione ENTER para tentar novamente...")
        
        except KeyboardInterrupt:
            print()
            print(f"{Cores.YELLOW}Operação cancelada pelo usuário.{Cores.RESET}")
            input("Pressione ENTER para voltar ao menu...")
        except Exception as erro:
            print(f"{Cores.RED}[ERRO] {erro}{Cores.RESET}")
            input("Pressione ENTER para voltar ao menu...")


if __name__ == "__main__":
    # Verificar se está no diretório correto
    if not Path("package.json").exists():
        print(f"{Cores.RED}[ERRO] package.json não encontrado!{Cores.RESET}")
        print("Execute este script no diretório raiz do projeto.")
        sys.exit(1)
    
    main()
