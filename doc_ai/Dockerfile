FROM node:14sudo -slim

ARG projectId
ARG processorId
ARG dataset

ENV PROJECTID=$projectId
ENV PROCESSORID=$processorId
ENV DATASET=$dataset
ENV PORT=8080

WORKDIR /src

COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]