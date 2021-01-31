FROM node:fermium-alpine as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
