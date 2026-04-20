# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Enable corepack for modern package managers if needed
# RUN corepack enable

COPY package*.json ./
COPY tsconfig.json ./
COPY turbo.json* ./
COPY apps/organizer-web/package*.json ./apps/organizer-web/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY apps/organizer-web ./apps/organizer-web
COPY packages/shared ./packages/shared

# Inject VITE_API_URL during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build -w @venue/organizer-web

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g sirv-cli

COPY --from=builder /app/apps/organizer-web/dist ./dist

EXPOSE 8080

# Serve the static files on port 8080 (Cloud Run default)
CMD ["sirv", "dist", "--port", "8080", "--single", "--host", "0.0.0.0"]
