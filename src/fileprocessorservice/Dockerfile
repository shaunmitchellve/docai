FROM node:14-slim

ARG projectId
ARG processorId
ARG dataset
ARG convertservice

ENV PROJECTID=$projectId
ENV PROCESSORID=$processorId
ENV DATASET=$dataset
ENV CONVERTSERVICE=$convertservice
ENV PORT=8080

WORKDIR /src

COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]