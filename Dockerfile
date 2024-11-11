# Use a lightweight Node.js image
FROM node:18-slim

# Set working directory inside container
WORKDIR /app

# Install OpenSSL (needed for Prisma in Docker)
RUN apt-get update && apt-get install -y openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Generate Prisma client (to work on both Windows and Docker)
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
