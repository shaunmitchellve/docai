FROM node:14-slim

ARG bucketname

ENV BUCKETNAME=$bucketname
ENV PORT=8080

WORKDIR /src

COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]