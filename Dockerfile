# FROM node:20-alpine
#
# WORKDIR /app
#
# ENV NODE_ENV production
#
# RUN yarn global add @nestjs/cli@^8.0.0
#
# COPY package.json yarn.lock ./
#
# RUN yarn
#
# COPY . .
#
# RUN yarn build
#
# RUN mkdir /run/secrets && touch /run/secrets/postgres_password && \
#   chown -R node:node /app /run/secrets/postgres_password
#
# USER node
#
# CMD ["yarn", "start:prod"]
#
FROM node:alpine AS base

FROM base AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --no-lockfile
COPY . .
RUN yarn build

FROM base AS production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/yarn.lock .
COPY --from=build /app/.env .

CMD ["sh", "-c", "yarn start:prod"]
