# syntax=docker.io/docker/dockerfile:1.7-labs

# ATTENTION: This docker file uses node 22.x. Regularly check if node version changed.
# https://github.com/microsoft/playwright/blob/main/utils/docker/Dockerfile.noble

# ATTENTION: If the docker image is changed here, it also needs to be changed in deploy-branch.yml and deploy-prod.yml

FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Set working directory
WORKDIR /app

# Install git (needed by husky / some npm packages)
# RUN apk add --no-cache git bash

# Copy everything
COPY --exclude=node_modules . .

# Install dependencies. Installed at: /home/node/app/node_modules
RUN npm install

# Expose port
EXPOSE 3000

# Set environment variable for cross-env
ENV ENV=local
