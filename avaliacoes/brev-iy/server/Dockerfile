FROM node:24-alpine AS base

RUN npm install -g pnpm@12.14.0

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Todas as dependências, necessárias para gerar o build
FROM base AS dependencies

RUN pnpm install --frozen-lockfile

# Apenas as dependências de produção, que vão para a imagem final
FROM base AS production-dependencies

RUN pnpm install --frozen-lockfile --prod

FROM base AS build

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm build

FROM node:24-alpine AS deploy

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=production-dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

# Executa sem privilégios de root
USER node

EXPOSE 3333

CMD ["node", "dist/server.js"]
