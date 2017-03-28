# Koa2 requires Node 7.x
FROM node:7-slim

# Node likes to ignore the default SIGTERM Signal sent by docker. To fix this
# use dumb-init as the PID1 >> https://github.com/Yelp/dumb-init

RUN apt-get update \
 && wget https://github.com/Yelp/dumb-init/releases/download/v1.0.2/dumb-init_1.0.2_amd64.deb \
 && dpkg -i dumb-init_*.deb \
 && rm dumb-init_*.deb

ENTRYPOINT ["dumb-init"]
CMD ["npm", "-q", "start"]
STOPSIGNAL SIGTERM

WORKDIR /app
EXPOSE 3000
ADD . /app
