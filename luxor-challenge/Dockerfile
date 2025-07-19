# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Install Prisma CLI
RUN npm install -g prisma
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
# Generate Prisma client
RUN npx prisma generate

# Start the app in development mode
CMD ["npm", "run", "dev"] 