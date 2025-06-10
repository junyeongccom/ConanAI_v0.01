# 모든 명령어 앞에 'make' 를 붙여서 실행해야 함
# 🔧 공통 명령어
up:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose down && docker-compose up -d --build

ps:
	docker-compose ps


# 🚀 마이크로서비스별 명령어

## n8n
build-n8n:
	docker-compose build n8n

up-n8n:
	docker-compose up -d n8n

down-n8n:
	docker-compose stop n8n

logs-n8n:
	docker-compose logs -f n8n

restart-n8n:
	docker-compose down n8n && docker-compose up -d --build n8n

## frontend
build-frontend:
	docker-compose build frontend

up-frontend:
	docker-compose up -d frontend

down-frontend:
	docker-compose stop frontend

logs-frontend:
	docker-compose logs -f frontend

restart-frontend:
	docker-compose down frontend && docker-compose up -d --build frontend

## gateway
build-gateway:
	docker-compose build gateway

up-gateway:
	docker-compose up -d gateway

down-gateway:
	docker-compose stop gateway

logs-gateway:
	docker-compose logs -f gateway

restart-gateway:
	docker-compose down gateway && docker-compose up -d --build gateway





## chatbot
build-chatbot:
	docker-compose build chatbot

up-chatbot:
	docker-compose up -d chatbot

down-chatbot:
	docker-compose stop chatbot

logs-chatbot:
	docker-compose logs -f chatbot

restart-chatbot:
	docker-compose down chatbot && docker-compose up -d --build chatbot

## finimpact
build-finimpact:
	docker-compose build finimpact

up-finimpact:
	docker-compose up -d finimpact

down-finimpact:
	docker-compose stop finimpact

logs-finimpact:
	docker-compose logs -f finimpact

restart-finimpact:
	docker-compose down finimpact && docker-compose up -d --build finimpact

## climate-service
build-climate:
	docker-compose build climate-service

up-climate:
	docker-compose up -d climate-service

down-climate:
	docker-compose stop climate-service

logs-climate:
	docker-compose logs -f climate-service

restart-climate:
	docker-compose down climate-service && docker-compose up -d --build climate-service

