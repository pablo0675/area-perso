FROM node:18-alpine

COPY . .
WORKDIR /app

RUN yarn

EXPOSE $PORT

ENV NODE_ENV=production

CMD ["yarn", "run", "start"]