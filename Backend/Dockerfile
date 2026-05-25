# ============================================
# Backend Dockerfile — Node.js Chat Server
# ============================================
# Build context is the project ROOT (Chit-Chat-master/)
# because package.json & package-lock.json live at root.
# Runs as non-root user 'node' for security.

FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency manifests from project root (Docker layer caching)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source code
COPY Backend/ ./Backend/

# Expose the backend port
EXPOSE 5000

# Run as non-root user for security
USER node

# Start the server (path relative to WORKDIR /app)
CMD ["node", "Backend/server.js"]
