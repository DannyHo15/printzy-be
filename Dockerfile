FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV production

RUN yarn global add @nestjs/cli@^8.0.0

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

RUN mkdir /run/secrets && touch /run/secrets/postgres_password && \
  chown -R node:node /app /run/secrets/postgres_password

USER node

CMD ["yarn", "start:prod"]
