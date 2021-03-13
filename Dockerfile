FROM node:fermium-alpine@sha256:a75f7cc536062f9266f602d49047bc249826581406f8bc5a6605c76f9ed18e98 as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:a75f7cc536062f9266f602d49047bc249826581406f8bc5a6605c76f9ed18e98
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
