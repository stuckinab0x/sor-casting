FROM alpine:3.15 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add yarn
COPY package.json yarn.lock tsconfig.json ./
RUN yarn --pure-lockfile

FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
ENTRYPOINT ["yarn", "run", "start"]
