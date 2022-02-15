FROM node:14-slim

ARG dataset
ARG projectid

ENV DATASET=$dataset
ENV PROJECTID=$projectId
ENV PORT=8080

WORKDIR /src

COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]