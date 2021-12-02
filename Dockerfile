FROM node:fermium-alpine@sha256:7bcf853eeb97a25465cb385b015606c22e926f548cbd117f85b7196df8aa0d29 as builder

WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN apk add --no-cache --virtual .gyp python g++ make \
    && yarn install \
    && apk del .gyp

ADD . .
RUN NODE_ENV=production yarn build

FROM node:fermium-alpine@sha256:7bcf853eeb97a25465cb385b015606c22e926f548cbd117f85b7196df8aa0d29
WORKDIR /app
ENV NODE_ENV production
ENV RELEASE $RELEASE

ADD package.json .
ADD yarn.lock .
RUN apk add --no-cache --virtual .gyp python g++ make \
    && yarn install \
    && apk del .gyp

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
