FROM node:8.9.4-alpine

RUN apk update 
RUN apk add nginx gettext libintl
RUN apk add --update bash

COPY nginx.conf /etc/nginx/nginx.conf.tmpl
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir /www
COPY build/index.html /www
COPY build/styles.css /www
COPY build/app.js /www
COPY build/favicon.ico /www

ENV BACKEND_0=BACKEND_0
ENV BACKEND_1=BACKEND_1
ENV BACKEND_2=BACKEND_2

EXPOSE 8085
CMD  /bin/bash -c "envsubst '\$BACKEND_0 \$BACKEND_1 \$BACKEND_2' < /etc/nginx/nginx.conf.tmpl > /etc/nginx/nginx.conf" && cat /etc/nginx/nginx.conf && nginx -g "daemon off;"
