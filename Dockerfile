FROM  node:18-alpine3.15

EXPOSE 3001

COPY . /app
WORKDIR /app

RUN yarn

RUN yarn run build

ENTRYPOINT  [ "yarn", "run", "start:no-build" ]