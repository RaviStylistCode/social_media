FROM node:18

COPY package*.json .
COPY config ./config
COPY controllers ./controllers
COPY middlewares ./middlewares
COPY models ./models
COPY routes ./routes
COPY utils ./utils
COPY app.js app.js
COPY server.js server.js

RUN npm install

CMD [ "node","server.js" ]
