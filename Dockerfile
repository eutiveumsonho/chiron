FROM alpine:3.12

RUN apk add --no-cache git
RUN apk add --no-cache nodejs-current npm
RUN npm install -g jsdoc

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]