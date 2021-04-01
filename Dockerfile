FROM node:fermium-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3 as builder

WORKDIR /app

ADD package.json .
ADD yarn.lock .
RUN yarn install

ADD . .
RUN NODE_ENV=production yarn build

FROM node:fermium-alpine@sha256:0a6a21d28509f56155007444075ef4fdd36eef0a97924623cb641d3766e3b8d3
WORKDIR /app
ENV NODE_ENV production
ENV RELEASE $RELEASE

ADD package.json .
ADD yarn.lock .
RUN yarn install

COPY --from=builder /app/bin /app/bin


CMD ["yarn", "start"]
