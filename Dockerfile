FROM node:8.9.4-alpine

RUN apk update
RUN apk add nginx

COPY nginx.conf /etc/nginx/nginx.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir /proj/
RUN mkdir /proj/build
COPY src /proj
COPY .babelrc /proj
COPY .eslintrc /proj
COPY package.json /proj
COPY webpack.config.js /proj

RUN cd /proj
RUN npm install
RUN npm run build

RUN mkdir /www/
COPY build/index.html /www
COPY build/styles.css /www
COPY build/app.js /www

EXPOSE 8085
CMD nginx -g "daemon off;"