FROM node:fermium-alpine@sha256:8bd6100693a93cca2a3c3b1d8dfbcb7434d4b1731c625204966a87ea2efb36bc as builder

WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN NODE_ENV=production yarn build

FROM node:fermium-alpine@sha256:8bd6100693a93cca2a3c3b1d8dfbcb7434d4b1731c625204966a87ea2efb36bc
WORKDIR /app
ENV NODE_ENV production
ENV RELEASE $RELEASE

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
