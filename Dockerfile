FROM node:8-alpine

ADD ./package.json /build/package.json
ADD ./yarn.lock /build/yarn.lock
RUN cd /build && yarn install --pure-lockfile

ADD . /source
RUN ln -sf /build/node_modules /source/node_modules

CMD ["node","/source/index"]
