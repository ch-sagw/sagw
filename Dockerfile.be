# syntax=docker.io/docker/dockerfile:1.7-labs

# Use Node 22 to match package engines
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install git (needed by husky / some npm packages)
RUN apk add --no-cache git bash

# Copy everything
COPY --exclude=node_modules . .

# Install dependencies. Installed at: /home/node/app/node_modules
RUN npm install

# Expose port
EXPOSE 3000

# Set environment variable for cross-env
ENV ENV=local
