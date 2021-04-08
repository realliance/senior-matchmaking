FROM node:fermium-alpine@sha256:bdec2d4aa13450a2e2654e562df1d8a3016b3c4ab390ccd3ed09d861cbdb0d83 as builder

WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN NODE_ENV=production yarn build

FROM node:fermium-alpine@sha256:bdec2d4aa13450a2e2654e562df1d8a3016b3c4ab390ccd3ed09d861cbdb0d83
WORKDIR /app
ENV NODE_ENV production
ENV RELEASE $RELEASE

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
