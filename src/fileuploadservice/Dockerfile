FROM node:14-slim

ARG bucketname

ENV BUCKETNAME=$bucketname

WORKDIR /src

COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]