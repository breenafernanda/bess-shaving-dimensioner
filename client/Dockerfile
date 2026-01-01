








# Dockerfile para o frontend React Vite
FROM node:20-slim

# Instala pnpm globalmente
RUN npm install -g pnpm

# Cria diretório de trabalho
WORKDIR /app

COPY client/package.json ./
COPY client/ .
COPY client/public ./public
COPY client/src ./src
COPY client/index.html ./index.html
COPY client/vite.config.ts ./vite.config.ts
COPY client/postcss.config.* ./
COPY client/tailwind.config.js ./
COPY client/shared ./shared

# Instala dependências principais
ENV NODE_OPTIONS="--experimental-vm-modules"
RUN pnpm install

# Inicia o servidor Vite
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
