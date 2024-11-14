# Use a lightweight Node.js image
FROM node:18-slim as builder

# Set working directory inside container
WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies including dev dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Ensure the `prisma` directory and `schema.prisma` are copied correctly
WORKDIR /app/prisma

# Generate Prisma client
RUN npx prisma generate

# Apply migrations to the database (if using migrations)
# Consider moving this to an entrypoint script if the database is not accessible at build time
# RUN npx prisma migrate deploy

# Return to the root working directory
WORKDIR /app

# Build the Next.js application
RUN npm run build

# Start a new, final image to reduce size
FROM node:18-slim

WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Add a non-root user
RUN adduser --disabled-password myuser
USER myuser

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
