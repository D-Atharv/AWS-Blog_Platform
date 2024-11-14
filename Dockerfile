# Stage 1: Builder
FROM node:18-slim as builder

# Set working directory inside the container
WORKDIR /app

# Install OpenSSL 3 library for Prisma
RUN apt-get update && apt-get install -y openssl libssl3

# Disable telemetry and skip type checking for faster builds
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SKIP_TYPE_CHECK=true

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy the entire project into the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Final Image
FROM node:18-slim

# Install OpenSSL 3 library in the final image as well
RUN apt-get update && apt-get install -y openssl libssl3

# Set working directory for the final stage
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/middleware.ts ./

# Add a non-root user for security
RUN adduser --disabled-password myuser
USER myuser

# Expose the port your application will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]