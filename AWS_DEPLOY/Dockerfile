FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./frontend/package*.json  /app

RUN npm i

COPY ./frontend /app

RUN npm run build


FROM node:20-alpine AS backend_builder

WORKDIR /app

COPY ./backend/package*.json  /app

RUN npm i

COPY ./backend /app

COPY --from=frontend_builder /app/dist /app/public

EXPOSE 3000

CMD ["node", "server.js"]
