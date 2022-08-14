DOCKER_IMAGE=dbondarchuk/weather-forecast:latest

init:
	yarn

format:
	yarn run format

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

docker: buld-docker start-docker
