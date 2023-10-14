FROM alpine:3.15
EXPOSE 5173
RUN apk add yarn
WORKDIR app
COPY package.json yarn.lock tsconfig.json .eslintrc.json ./
WORKDIR frontend
COPY frontend/package.json frontend/tsconfig.json ./
COPY frontend/src/ src/
COPY frontend/public/ public/
RUN yarn --pure-lockfile
ENTRYPOINT ["yarn", "run", "start"]
