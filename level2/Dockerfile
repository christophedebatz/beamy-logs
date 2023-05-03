FROM node:12.19.0-alpine
MAINTAINER Btz Studio <christophe.db@gmail.com>

# install base dependencies
RUN apk update && apk add curl bash

# install nodejs 12.x
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
RUN apk add nodejs
RUN npm i typescript -g
RUN node -v && npm -v

WORKDIR /app

COPY src/ ./src/
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

RUN ls . && mkdir build && npm i && npm run build
