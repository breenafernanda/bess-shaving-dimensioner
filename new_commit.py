import os
import subprocess
import sys

# Tenta importar colorama, mas funciona sem ele
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
    YELLOW = Fore.YELLOW
    MAGENTA = Fore.MAGENTA
    CYAN = Fore.CYAN
    RESET = Style.RESET_ALL
except ImportError:
    # Se colorama não estiver instalado, usa strings vazias
    YELLOW = MAGENTA = CYAN = RESET = ""

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        print(f"{CYAN}► {result.stdout.strip()}")
    if result.stderr:
        print(f"{MAGENTA}⚠ {result.stderr.strip()}")
    return result.returncode

def setup_git(user_name, user_email, commit_name, repo_url=None):
    print(f"\n{YELLOW}┌{'─'*50}")
    print(f"{YELLOW}│ PROCESSO DE CONFIGURAÇÃO GIT")
    print(f"{YELLOW}└{'─'*50}")

    # 1. Configuração global
    print(f"\n{YELLOW}[1/5] {MAGENTA}Configurando Git global...")
    run(f'git config --global user.name "{user_name}"')
    run(f'git config --global user.email "{user_email}"')

    # 2. Inicializar repositório
    print(f"\n{YELLOW}[2/5] {MAGENTA}Inicializando repositório Git...")
    run("git init")

    # 3. Verificar se .gitignore existe
    print(f"\n{YELLOW}[3/5] {MAGENTA}Verificando arquivo .gitignore...")
    if os.path.exists(".gitignore"):
        print(f"{CYAN}► .gitignore já existe")
    else:
        print(f"{MAGENTA}⚠ .gitignore não encontrado! Crie antes de fazer push.")

    # 4. Adicionar e fazer commit
    print(f"\n{YELLOW}[4/5] {MAGENTA}Criando commit...")
    run("git add .")
    run(f'git commit -m "👾 {commit_name}"')

    # 5. (Opcional) Configurar origin e fazer push
    print(f"\n{YELLOW}[5/5] {MAGENTA}Configurando remote origin e enviando...")
    if repo_url:
        try:
            run(f"git remote add origin {repo_url}")
        except:
            pass
        run("git branch -M main")
        run("git push -u origin main")

    print(f"\n{YELLOW}┌{'─'*50}")
    print(f"{YELLOW}│ {MAGENTA}Configuração Git concluída com sucesso!")
    print(f"{YELLOW}└{'─'*50}")

# --- Executar com seus dados ---
if __name__ == "__main__":
    repositorio = "bess-shaving-dimensioner"
    repositorio_link = f"https://github.com/breenafernanda/{repositorio}.git"
    
    # Verifica se a mensagem de commit foi fornecida via linha de comando
    if len(sys.argv) > 1:
        commit = " ".join(sys.argv[1:])  # Aceita mensagens com espaços
    else:
        timestamp = subprocess.getoutput("date +'%Y-%m-%d %H:%M:%S'")
        commit = f'SavePoint - {timestamp}'  
    
    print(f"\n{YELLOW}┌{'─'*50}")
    print(f"{YELLOW}│ {CYAN}REPOSITÓRIO: {MAGENTA}{repositorio}")
    print(f"{YELLOW}│ {CYAN}MENSAGEM DO COMMIT: {MAGENTA}{commit}")
    print(f"{YELLOW}└{'─'*50}")
    
    setup_git("breenafernanda", "d201810853@uftm.edu.br", commit, repositorio_link)