FROM node:8.9.4

RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y bash git libpng-dev
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

RUN ls /proj/src/resources/img/checkbox/ && ls /proj/src/resources/img/common/

RUN npm config set registry "https://registry.npmjs.org/"
RUN npm config list && npm -version && node --version

RUN /bin/bash -c " cd /proj && npm install && npm run build &&  mkdir /www && cp  /proj/build/index.html /www && cp  /proj/build/styles.css /www && cp  /proj/build/app.js /www"

EXPOSE 8085
CMD nginx -g "daemon off;"
