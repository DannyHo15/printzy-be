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
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# # Install NestJS CLI globally using npm (optional, if you need it for your project)
# RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json yarn.lock ./
COPY  poised-shift-422808-d9-firebase-adminsdk-7mpf9-965a8b765c.json ./

# Install dependencies using npm
RUN yarn


# Copy the remaining application files
COPY . .


USER node
# Expose port 3020
EXPOSE 3020

# Start the application in development mode using npm
CMD ["npm", "run", "start:dev"]

