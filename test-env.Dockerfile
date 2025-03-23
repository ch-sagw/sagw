# syntax=docker.io/docker/dockerfile:1.7-labs
FROM mcr.microsoft.com/playwright:v1.51.1-noble
WORKDIR /src
COPY --exclude=node_modules . .
RUN npm install
