FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Install additional dependencies if needed
RUN apt-get update && apt-get install -y \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*
