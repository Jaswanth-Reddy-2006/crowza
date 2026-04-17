# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

RUN npm run build -w @venue/backend

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/server.js"]
