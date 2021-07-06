FROM node:14-slim

ARG writeBucket

ENV PORT=8080
ENV WRITEBUCKET=$writeBucket

RUN apt-get update
RUN apt-get -y install ghostscript
RUN apt-get -y install graphicsmagick

WORKDIR /src

COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]