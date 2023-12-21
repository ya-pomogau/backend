FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; then npm ci --only=production; else npm install; fi

CMD [ "npm", "start" ]