# Step 1: Use an official Node.js image as the base image
FROM node:18-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Expose the port your app will run on
EXPOSE 3000

# Step 8: Command to run the application
CMD ["npm", "start"]
