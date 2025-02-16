FROM node:20 AS app

RUN apt-get update && \
  apt-get install sqlite3 -y

WORKDIR /app
COPY app .

RUN npm install

CMD ["node", "index.js"]

