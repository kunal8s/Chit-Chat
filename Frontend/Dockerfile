# ============================================
# Frontend Dockerfile — React + Vite (Multi-Stage)
# ============================================
# Stage 1: Build the React app with Vite
# Stage 2: Serve the static files with Nginx

# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first (Docker layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy frontend source code
COPY . .

# Build the production bundle
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:1.25-alpine

# Copy the built static files to Nginx's default HTML root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
