# Dockerfile para o projeto BESS Peak Shaving Dimensioner
# Imagem base Node.js LTS + Python 3.11
FROM node:20-bullseye

# Instala Python 3.11 e utilitários
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv git && \
    rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos do projeto
COPY . .

# Instala pnpm globalmente
RUN npm install -g pnpm

# Instala dependências do Node.js (incluindo devDependencies)
RUN pnpm install --frozen-lockfile

# Instala dependências Python (se houver requirements.txt)
RUN if [ -f "requirements.txt" ]; then pip3 install -r requirements.txt; fi

# Porta padrão do Vite
EXPOSE 3000

# Comando padrão: inicia o servidor de desenvolvimento
CMD ["pnpm", "dev"]
