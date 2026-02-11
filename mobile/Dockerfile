# ./mobile/Dockerfile
FROM node:22.21.1-alpine3.23

WORKDIR /app

# Instalar dependencias globales de expo-cli (opcional en versiones nuevas, pero útil)
RUN npm install -g expo-cli

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Exponer puertos comunes de Expo
EXPOSE 8081 19000 19001 19006

# Start normal (puede ser start --tunnel si tienes problemas de red)
CMD ["npx", "expo", "start", "--host", "lan"]