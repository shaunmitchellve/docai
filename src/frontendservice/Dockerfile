FROM node:14-slim as build-step

ARG uploadservice
ENV REACT_APP_UPLOADSERVICE=$uploadservice

RUN mkdir /app

WORKDIR /app
COPY . ./
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

COPY --from=build-step /app/build /usr/share/nginx/html

ENV PORT 80
ENV HOST 0.0.0.0
EXPOSE 80

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"