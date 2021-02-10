FROM node:fermium-alpine@sha256:d36152974d98ad2f340c4ac72228bc8665cb96dcfef97120f735290406a3fbce as builder

WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN yarn build

FROM node:fermium-alpine@sha256:d36152974d98ad2f340c4ac72228bc8665cb96dcfef97120f735290406a3fbce
WORKDIR /app
ENV NODE_ENV production

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
