FROM node:fermium-alpine@sha256:07b040b2feb82b5384c2449630a4591138485476d20f7caf96ac8a6725056381 as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:07b040b2feb82b5384c2449630a4591138485476d20f7caf96ac8a6725056381
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
