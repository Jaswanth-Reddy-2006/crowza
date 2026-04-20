# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY turbo.json* ./
COPY apps/organizer-web/package*.json ./apps/organizer-web/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

# Copy shared package
COPY packages/shared ./packages/shared
RUN npm run build -w @crowza/shared

# Copy app source
COPY apps/organizer-web ./apps/organizer-web

# Inject VITE_API_URL during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build -w @venue/organizer-web

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g sirv-cli

COPY --from=builder /app/apps/organizer-web/dist ./dist

EXPOSE 8080

CMD ["sirv", "dist", "--port", "8080", "--single", "--host", "0.0.0.0"]
