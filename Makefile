DOCKER_IMAGE_NAME=dbondarchuk/weather-forecast
DOCKER_TAG:=$(shell git rev-parse --short HEAD)

DOCKER_IMAGE=${DOCKER_IMAGE_NAME}:${DOCKER_TAG}

init:
	yarn

format:
	yarn run format

lint:
	yarn run lint

start:
	yarn run start

start-dev:
	yarn run start:dev

start-docker:
	docker run -p:3001:3001 ${DOCKER_IMAGE}

build:
	yarn run build

build-docker:
	docker build -t ${DOCKER_IMAGE} .

publish-docker:
	docker push ${DOCKER_IMAGE}

docker-tag-latest:
	docker tag ${DOCKER_IMAGE} ${DOCKER_IMAGE_NAME}:latest

publish-docker-latest:
	docker push ${DOCKER_IMAGE_NAME}:latest

publish-docker-all: publish-docker docker-tag-latest publish-docker-latest

test:
	yarn run test

docker: buld-docker start-docker
