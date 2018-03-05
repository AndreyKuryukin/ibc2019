FROM node:8.9.4-alpine

RUN apt-get update
RUN apt-get install -y nginx

COPY nginx.conf /etc/nginx/nginx.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir /www
COPY build/index.html /www
COPY build/styles.css /www
COPY build/app.js /www

EXPOSE 8085
CMD nginx -g "daemon off;"
