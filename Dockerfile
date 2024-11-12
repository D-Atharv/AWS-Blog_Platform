# Use a lightweight Node.js image
FROM node:18-slim

# Set working directory inside container
WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Ensure the `prisma` directory and `schema.prisma` are copied correctly
WORKDIR /app/prisma

# Generate Prisma client
RUN npx prisma generate

# Apply migrations to the database (if using migrations)
RUN npx prisma migrate deploy

# Return to the root working directory
WORKDIR /app

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]