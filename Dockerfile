FROM node:fermium-alpine@sha256:cafb95169f2a92608843508485fd3d2c73fbe82b3c4c36e3a99adc5acab438df as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:cafb95169f2a92608843508485fd3d2c73fbe82b3c4c36e3a99adc5acab438df
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
