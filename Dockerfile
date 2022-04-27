FROM node:gallium-bullseye-slim AS app

WORKDIR /app
COPY app .

RUN npm install

CMD ["node", "index.js"]

