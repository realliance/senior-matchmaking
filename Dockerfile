FROM node:fermium-alpine@sha256:61f5ce614667fc85b4ff48b4f4817073da6844c2da67dd15b15bc2b7175823c4 as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:61f5ce614667fc85b4ff48b4f4817073da6844c2da67dd15b15bc2b7175823c4
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
