FROM node:8.9.4-alpine

RUN apk update
RUN apk add nginx
RUN apk add --no-cache bash git openssh
COPY id_rsa_fe /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa

COPY nginx.conf /etc/nginx/nginx.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

RUN mkdir /proj/
RUN mkdir /proj/build
COPY src/ /proj/src
COPY .babelrc /proj
COPY .eslintrc.js /proj
COPY package.json /proj
COPY webpack.config.js /proj

RUN cd /proj && ls && npm install && npm run build &&  mkdir /www && cp  /proj/build/index.html /www && cp  /proj/build/styles.css /www && cp  /proj/build/app.js /www

EXPOSE 8085
CMD nginx -g "daemon off;"
