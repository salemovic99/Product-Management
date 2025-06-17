# syntax=docker/dockerfile:1

# --- Base Stage ---
FROM node:20-alpine AS base
# Set working directory inside the container
WORKDIR /app

# Disable Next.js telemetry for production builds (optional)
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies (only when needed, leverages Docker caching)
FROM base AS dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && npm install; \
  fi

# --- Build Stage ---
FROM base AS builder
# Copy node_modules from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy application source code
COPY . .

# Build the Next.js application
RUN npm run build

# --- Runner Stage (Production Image) ---
FROM node:20-alpine AS runner
# Set working directory
WORKDIR /app

# Create a non-root user for security
# This is a best practice to avoid running your application as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy the standalone build output and public assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static 

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the Next.js app in standalone mode
# HOSTNAME="0.0.0.0" is crucial for Docker to bind to all network interfaces
CMD ["node", "server.js"]