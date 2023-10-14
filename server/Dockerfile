FROM alpine:3.15 as builder
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN apk add yarn
WORKDIR app
COPY package.json yarn.lock tsconfig.json .eslintrc.json ./
WORKDIR server
COPY server/package.json ./
COPY server/src/ src/
WORKDIR ../frontend
COPY frontend/index.html frontend/package.json frontend/tsconfig.json frontend/tsconfig.node.json frontend/vite.config.ts ./
COPY frontend/src/ src/
COPY frontend/public/ public/
RUN yarn --pure-lockfile
RUN if [ "$NODE_ENV" = "production" ] ; then set -e; yarn run build ; mv dist ../server/src/public ; rm -rf ../frontend ; fi

FROM alpine:3.15
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
EXPOSE 80
RUN apk add yarn
COPY --from=builder app/ app/
WORKDIR app/server
ENTRYPOINT ["yarn", "run", "start"]
