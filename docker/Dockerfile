# Stage 1: Build the application
FROM node:20.16.0-alpine AS builder
# Install dependencies (including Python and build tools)
RUN apk add --no-cache bash python3 make g++
# Set the working directory inside the container
WORKDIR /usr/app
# Copy package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm ci --silent
# Copy the rest of the application code
COPY . .
# Rebuild bcrypt with the correct architecture
RUN npm rebuild bcrypt --build-from-source
# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:20.16.0-alpine
# Copy only the necessary files from the build stage
COPY --from=builder /usr/app/dist ./
# Copy node_modules from the build stage
COPY --from=builder /usr/app/node_modules ./node_modules
# Copy .env file
COPY --from=builder /usr/app/.env ./
# Copy package.json file
COPY package.json ./