FROM node:22-bookworm-slim

WORKDIR /app

# 依存をイメージビルド時に固定化して、別PCでも同じ手順で起動できるようにする
COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3000
CMD ["npm", "run", "dev"]