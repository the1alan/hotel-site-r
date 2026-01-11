# 🏨 Hotel Site

Демоверсия гостиницы с CRUD для номеров.

**Live:** https://hotel-site-r.onrender.com

## Технологический стек

- **Backend:** Node.js + Express.js
- **БД:** MongoDB Atlas (облако)
- **Контейнеризация:** Docker + Docker Compose
- **Хостинг:** Render.com
- **Авторизация:** Session-based

## Локальный запуск

```bash
# Dev режим (с Docker)
docker-compose up

# Production режим
docker-compose -f docker-compose.prod.yml up
