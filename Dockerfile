FROM node:20-buster as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-buster

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist/ ./dist/

EXPOSE 3000
CMD ["node", "dist/index.js"]

