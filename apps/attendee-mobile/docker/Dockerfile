# Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY apps/attendee-mobile/package*.json ./apps/attendee-mobile/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/design-system/package*.json ./packages/design-system/

RUN npm install

COPY apps/attendee-mobile ./apps/attendee-mobile
COPY packages/shared ./packages/shared
COPY packages/design-system ./packages/design-system

# Inject API URL
ARG EXPO_PUBLIC_API_URL
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

WORKDIR /app/apps/attendee-mobile
RUN npx expo export --platform web

# Production stage
FROM node:20-slim

WORKDIR /app

RUN npm install -g sirv-cli

COPY --from=builder /app/apps/attendee-mobile/dist ./dist

EXPOSE 8080

CMD ["sirv", "dist", "--port", "8080", "--single", "--host", "0.0.0.0"]
