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

## disclosure
build-disclosure:
	docker-compose build disclosure

up-disclosure:
	docker-compose up -d disclosure

down-disclosure:
	docker-compose stop disclosure

logs-disclosure:
	docker-compose logs -f disclosure

restart-disclosure:
	docker-compose down disclosure && docker-compose up -d --build disclosure

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

## auth
build-auth:
	docker-compose build auth

up-auth:
	docker-compose up -d auth

down-auth:
	docker-compose stop auth

logs-auth:
	docker-compose logs -f auth

restart-auth:
	docker-compose down auth && docker-compose up -d --build auth

## training-service
build-training:
	docker-compose build training-service

up-training:
	docker-compose up -d training-service

down-training:
	docker-compose stop training-service

logs-training:
	docker-compose logs -f training-service

restart-training:
	docker-compose down training-service && docker-compose up -d --build training-service

# 🤖 AI 모델 관련 명령어

# 초기 모델 생성 (베이스 모델 다운로드 + LoRA 어댑터 생성)
setup-model: up-training
	docker-compose exec training-service python /app/app/generate_initial_model.py

# 로컬 모델 채팅 테스트 (대화형)
test-chat: up-training
	docker-compose exec training-service python /app/app/test_model.py

# 모델 훈련 실행
train-model: up-training
	docker-compose exec training-service python /app/app/train_model.py

# 토크나이저 수정 (필요시)
fix-tokenizer: up-training
	docker-compose exec training-service python /app/app/fix_tokenizer.py

# 컨테이너 접속 (디버깅용)
shell-training: up-training
	docker-compose exec training-service bash

# 모델 파일 확인
check-models: up-training
	@echo "=== 베이스 모델 파일 ==="
	docker-compose exec training-service ls -la /app/models/base_model/llama3-korean-bllossom-8b/
	@echo ""
	@echo "=== LoRA 어댑터 파일 ==="
	docker-compose exec training-service ls -la /app/models/initial_adapters/llama3-init/

# 모델 용량 확인
check-size: up-training
	docker-compose exec training-service bash -c "du -sh /app/models/*"
