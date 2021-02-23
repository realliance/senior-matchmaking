FROM node:fermium-alpine@sha256:1cd49c2bac495b65972996712a36f38f2aeb29cf45008b0d78602331e48c5391 as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:1cd49c2bac495b65972996712a36f38f2aeb29cf45008b0d78602331e48c5391
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
