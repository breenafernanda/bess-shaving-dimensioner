import subprocess
import sys

def menu():
    print("\n==== MENU BESS DOCKER ====")
    print("1 - Build Docker (docker compose build)")
    print("2 - Rebuild frontend (docker compose build frontend)")
    print("3 - Rebuild backend (docker compose build backend)")
    print("4 - Logs Viewer (docker compose logs -f)")
    print("5 - Up (docker compose up -d)")
    print("6 - Down (docker compose down)")
    print("0 - Sair")

def main():
    while True:
        menu()
        op = input("Escolha uma opção: ").strip()
        if op == "1":
            subprocess.run(["docker", "compose", "build"])
        elif op == "2":
            subprocess.run(["docker", "compose", "build", "--no-cache", "frontend"])
        elif op == "3":
            subprocess.run(["docker", "compose", "build",  "--no-cache","backend"])
        elif op == "4":
            subprocess.run(["docker", "compose", "logs", "-f"])
        elif op == "5":
            subprocess.run(["docker", "compose", "up", "-d"])
        elif op == "6":
            subprocess.run(["docker", "compose", "down"])
        elif op == "0":
            print("Saindo...")
            sys.exit(0)
        else:
            print("Opção inválida!")

if __name__ == "__main__":
    main()
