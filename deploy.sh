#!/bin/bash

# Скрипт для деплоя приложения
echo "🚀 Начинаем деплой sport-frontend..."

# Проверяем, что Docker установлен
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем, что docker-compose установлен
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose не установлен. Установите docker-compose и попробуйте снова."
    exit 1
fi

# Останавливаем старые контейнеры
echo "🛑 Останавливаем старые контейнеры..."
docker-compose down

# Удаляем старые образы
echo "🗑️ Очищаем старые образы..."
docker image prune -f

# Собираем и запускаем новый контейнер
echo "🔨 Собираем и запускаем новый контейнер..."
docker-compose up -d --build

# Проверяем статус
echo "📊 Проверяем статус контейнера..."
docker-compose ps

echo "✅ Деплой завершен!"
echo "🌐 Приложение доступно по адресу: https://profile.t9d.store"
