# 🐳 Docker Deployment Guide — Chit-Chat Application

This guide covers how to build, run, and manage the Chit-Chat application using Docker and Docker Compose.

---

## Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Docker Engine | v25+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |

> **Note:** Docker Desktop for Windows/macOS includes both Docker Engine and Docker Compose.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      User's Browser                             │
│          React SPA ←──HTTP/WS──► Nginx Proxy (Port 80)          │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
  ┌───────────────────────┐     ┌─────────────────────────┐
  │     REST API           │     │   WebSocket Server       │
  │  Node.js / Express     │     │  Node.js / Socket.io     │
  │    (Port 5000)         │     │  (Port 5000, /socket.io) │
  └───────────┬────────────┘     └──────────┬──────────────┘
              └────────────┬────────────────┘
                           ▼
              ┌──────────────────────┐
              │  MongoDB (Port 27017)│
              │  Volume: mongo_data  │
              └──────────────────────┘
```

### Container Summary

| Service | Container Name | Image | Exposed Port |
|---------|---------------|-------|--------------|
| MongoDB | `chat-mongodb` | `mongo:7` | 27017 (internal) |
| Backend | `chat-backend` | Built from `./Backend` | 5000 (internal) |
| Frontend | `chat-frontend` | Built from `./Frontend` | 80 (internal) |
| Nginx Proxy | `chat-nginx` | Built from `./nginx` | **80 → Host** |

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Chit-Chat-master
```

### 2. (Optional) Configure Environment

Edit the JWT secret for production:

```bash
# Set your own secret
export JWT_SECRET="your-super-secret-key-here"
```

Or create a `.env` file in the project root:

```env
JWT_SECRET=your-super-secret-key-here
```

### 3. Build and Start All Services

```bash
docker compose up --build
```

This single command will:
1. Build the **Backend** Docker image (Node.js 20 Alpine)
2. Build the **Frontend** Docker image (Vite build → Nginx Alpine)
3. Build the **Nginx reverse proxy** image
4. Pull the **MongoDB 7** image
5. Start all containers in the correct dependency order
6. Wait for health checks to pass before starting dependent services

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost
```

> The Nginx reverse proxy handles all routing automatically.

---

## Managing the Stack

### Start in detached mode (background)

```bash
docker compose up --build -d
```

### Check container health

```bash
docker compose ps
```

Expected output — all containers should show `Up (healthy)`:

```
NAME             IMAGE               STATUS                   PORTS
chat-mongodb     mongo:7             Up (healthy)             27017/tcp
chat-backend     chit-chat-backend   Up (healthy)             5000/tcp
chat-frontend    chit-chat-frontend  Up (healthy)             80/tcp
chat-nginx       chit-chat-nginx     Up                       0.0.0.0:80->80/tcp
```

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

### Stop all services

```bash
docker compose down
```

### Stop and remove all data (including MongoDB volume)

```bash
docker compose down -v
```

---

## Health Check Endpoints

| Service | Health Check | Interval |
|---------|-------------|----------|
| MongoDB | `mongosh --eval 'db.adminCommand("ping")'` | 10s |
| Backend | `GET /api/health` → `{"status":"ok"}` | 10s |
| Frontend | `wget http://localhost:80` | 10s |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `MONGO_DB_URI` | `mongodb://chat-mongodb:27017/chatapp` | MongoDB connection string |
| `JWT_SECRET` | `change-me-in-production` | Secret key for JWT signing |
| `NODE_ENV` | `production` | Node.js environment |

---

## Persistent Data

MongoDB data is stored in a Docker named volume called `mongo_data`.

```bash
# List volumes
docker volume ls

# Inspect the volume
docker volume inspect chit-chat-master_mongo_data
```

> ⚠️ Running `docker compose down -v` will **delete** the MongoDB volume and all stored data.

---

## Troubleshooting

### Port 80 already in use

If port 80 is occupied, change the Nginx port mapping in `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80"    # Access app at http://localhost:8080
```

### Backend can't connect to MongoDB

Ensure MongoDB is healthy before the backend starts. Check logs:

```bash
docker compose logs mongodb
docker compose logs backend
```

### WebSocket connection fails

Verify Nginx is correctly proxying WebSocket upgrades:

```bash
docker compose logs nginx
```

The Nginx config includes the required `Upgrade` and `Connection` headers for WebSocket support.
