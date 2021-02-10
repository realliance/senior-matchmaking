FROM node:fermium-alpine@sha256:631ad30cbe1a7e5987c25d80ae9c1279fff478a5fa5787659730fb4286664e11 as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:631ad30cbe1a7e5987c25d80ae9c1279fff478a5fa5787659730fb4286664e11
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
