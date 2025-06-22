#!/bin/bash

# Deployment script for sport-frontend

echo "🚀 Starting deployment process..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t sport-frontend:latest .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop sport-frontend 2>/dev/null || true
docker rm sport-frontend 2>/dev/null || true

# Run new container
echo "▶️ Starting new container..."
docker run -d \
  --name sport-frontend \
  --restart unless-stopped \
  -p 80:80 \
  -e VITE_API_URL=http://t9d.store/api \
  sport-frontend:latest

# Check if container is running
if docker ps | grep -q sport-frontend; then
  echo "✅ Deployment successful! Application is running on http://localhost"
  echo "🔗 API URL: http://t9d.store/api"
else
  echo "❌ Deployment failed!"
  docker logs sport-frontend
  exit 1
fi

echo "🎉 Deployment completed!"
