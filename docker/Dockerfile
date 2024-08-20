# docker/Dockerfile

# Stage 1: Build the application
FROM arm32v7/node:20.16.0-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Copy env file
COPY .env ./

# Install dependencies
RUN npm ci --silent

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:20.16.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env ./

# Expose the application port (e.g., 3000)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start:prod"]