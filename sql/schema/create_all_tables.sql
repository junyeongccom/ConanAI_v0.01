-- SQL Script for Sky-C Climate Disclosure Database Schema

-- Set the default schema if needed (e.g., public)
SET search_path TO public;

-- 1. User Table (사용자 정보)
-- Google OAuth 연동 시 필드 반영
CREATE TABLE IF NOT EXISTS "user" (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID 기본값 설정
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255), -- Nullable, Unique 제약 해제
    company_name VARCHAR(255),
    industry_type VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 2. issb_s2_disclosure Table (ISSB S2 공시 지표 정보)
-- 역할: 공시 보고서의 큰 틀을 구성하는 최상위 지표 정보를 담습니다.
CREATE TABLE IF NOT EXISTS issb_s2_disclosure (
    -- 기본 키, CSV 파일의 disclosure_id 형태 (s2-g1, s2-r2, s2-s5 등)를 그대로 사용
    disclosure_id VARCHAR(255) PRIMARY KEY,
    -- IFRS S2의 4대 영역 (지배구조, 전략, 위험관리, 지표 및 목표)
    section VARCHAR(255) NOT NULL,
    -- 각 영역 내의 상세 카테고리
    category VARCHAR(255) NOT NULL,
    -- 카테고리 하위의 구체적인 주제 (Nullable)
    topic VARCHAR(255),
    -- 공시 지표의 국문 설명
    disclosure_ko TEXT NOT NULL
);


-- 3. issb_s2_requirement Table (S2 지표별 요구사항)
-- 역할: 사용자에게 질문할 내용과 그 질문의 형태(type, schema)를 정의하는 핵심 테이블입니다.
CREATE TABLE IF NOT EXISTS issb_s2_requirement (
    -- 기본 키. 'gov-1', 'str-1'과 같은 접두사 기반 ID를 사용하기 위해 VARCHAR로 변경.
    requirement_id VARCHAR(255) PRIMARY KEY,
    -- 외래 키: 어떤 공시 지표(disclosure)에 속하는 질문인지 명시합니다.
    disclosure_id VARCHAR(255),
    -- 같은 지표 내에서 질문이 표시될 순서를 정의합니다.
    requirement_order INT NOT NULL DEFAULT 0,
    -- 사용자에게 실제로 보여줄 질문 텍스트입니다.
    requirement_text_ko TEXT NOT NULL,
    -- 입력 UI의 형태를 결정하는 타입. (예: text, text_long, table_input, structured_list, select 등)
    data_required_type VARCHAR(50) NOT NULL,
    -- 'table_input', 'structured_list' 등 복합 입력 UI의 상세 구조(컬럼, 필드 정보)를 정의하는 JSONB 컬럼.
    input_schema JSONB,
    -- 단일 입력창에 보여줄 플레이스홀더 텍스트 (Nullable).
    input_placeholder_ko TEXT,
    -- 입력에 대한 추가적인 안내 문구 (Nullable).
    input_guidance_ko TEXT,
    -- 레코드 생성 및 마지막 수정 타임스탬프.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- 외래 키 제약 조건 설정
    CONSTRAINT fk_disclosure
        FOREIGN KEY (disclosure_id)
        REFERENCES issb_s2_disclosure(disclosure_id)
        ON DELETE SET NULL -- disclosure가 삭제되어도 requirement는 남을 수 있도록 변경
);


-- 4. answer Table (사용자별 요구사항 응답 데이터)
-- 역할: 각 사용자가 각 requirement에 대해 입력한 답변을 저장합니다.
CREATE TABLE IF NOT EXISTS answer (
    -- 답변의 고유 ID.
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- 답변을 작성한 사용자의 ID (user 테이블 외래 키).
    user_id UUID NOT NULL,
    -- 어떤 질문(requirement)에 대한 답변인지 명시 (issb_s2_requirement 외래 키). VARCHAR로 타입 일치.
    requirement_id VARCHAR(255) NOT NULL,

    -- --- 답변 값 저장 컬럼 ---
    -- 'text', 'number', 'date' 등 단일 텍스트로 표현 가능한 답변 저장.
    answer_value_text TEXT,
    -- 'text_long' 타입의 긴 서술형 답변 저장.
    answer_value_text_long TEXT,
    -- 'table_input', 'structured_list' 등 JSON 형태로 저장되어야 하는 복합 답변 저장.
    -- 가장 유연하고 강력한 방식.
    answer_value_json JSONB,

    -- 답변 생성 및 마지막 수정 타임스탬프.
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_edited_at TIMESTAMP WITH TIME ZONE,
    -- 답변의 상태 관리 (예: DRAFT, COMPLETED).
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,

    -- 외래 키 제약 조건 설정
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE, -- 사용자가 탈퇴하면 답변도 함께 삭제
    CONSTRAINT fk_requirement
        FOREIGN KEY (requirement_id)
        REFERENCES issb_s2_requirement(requirement_id)
        ON DELETE CASCADE, -- 질문이 삭제되면 답변도 함께 삭제

    -- 복합 고유 키 제약 조건: 한 사용자는 하나의 질문에 대해 하나의 답변만 가질 수 있도록 보장.
    -- 이 제약 덕분에 'INSERT ... ON CONFLICT DO UPDATE' (Upsert) 구문을 효율적으로 사용할 수 있음.
    CONSTRAINT uq_user_requirement UNIQUE (user_id, requirement_id)
);


-- 5. issb_s2_term Table (S2 용어 정의)
CREATE TABLE IF NOT EXISTS issb_s2_term (
    term_id SERIAL PRIMARY KEY, -- INT 대신 SERIAL 사용 (자동 증가)
    term_ko VARCHAR(255) UNIQUE NOT NULL,
    term_en VARCHAR(255), -- Nullable
    definition_ko TEXT NOT NULL,
    definition_en TEXT, -- Nullable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. climate_disclosure_concept Table (기후공시 개념)
CREATE TABLE IF NOT EXISTS climate_disclosure_concept (
    concept_id SERIAL PRIMARY KEY, -- INT 대신 SERIAL 사용 (자동 증가)
    concept_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255), -- Nullable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. issb_adoption_status Table (국가별 ISSB 도입 현황)
CREATE TABLE IF NOT EXISTS issb_adoption_status (
    adoption_id SERIAL PRIMARY KEY, -- INT 대신 SERIAL 사용 (자동 증가)
    country VARCHAR(255) UNIQUE NOT NULL,
    regulatory_authority VARCHAR(255),
    applicable_entity VARCHAR(255),
    adoption_timeline TEXT,
    remark TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 폭염일수 요약 데이터 테이블 생성 (PostgreSQL 버전)
CREATE TABLE IF NOT EXISTS heatwave_summary (
    id SERIAL PRIMARY KEY,
    scenario VARCHAR(50) NOT NULL,
    region_name VARCHAR(100) NOT NULL,
    year_period VARCHAR(10) NOT NULL,
    heatwave_days REAL NOT NULL,
    change_amount REAL,
    change_rate REAL,
    baseline_value REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 테이블 및 컬럼에 코멘트 추가 (PostgreSQL 방식)
COMMENT ON TABLE heatwave_summary IS '폭염일수 요약 데이터';
COMMENT ON COLUMN heatwave_summary.id IS '기본키 (자동증가)';
COMMENT ON COLUMN heatwave_summary.scenario IS '기후 시나리오 (SSP1-2.6, SSP2-4.5, SSP3-7.0, SSP5-8.5)';
COMMENT ON COLUMN heatwave_summary.region_name IS '지역명 (경기도, 전라남도 등)';
COMMENT ON COLUMN heatwave_summary.year_period IS '연도구간 (2025, 2030, 2040, 2050)';
COMMENT ON COLUMN heatwave_summary.heatwave_days IS '폭염일수 (평균값)';
COMMENT ON COLUMN heatwave_summary.change_amount IS '변화량(일수) - 2025년 대비';
COMMENT ON COLUMN heatwave_summary.change_rate IS '변화율(%) - 2025년 대비';
COMMENT ON COLUMN heatwave_summary.baseline_value IS '기준값 (2025년 폭염일수)';
COMMENT ON COLUMN heatwave_summary.created_at IS '데이터 생성일시';

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_heatwave_scenario ON heatwave_summary(scenario);
CREATE INDEX IF NOT EXISTS idx_heatwave_region ON heatwave_summary(region_name);
CREATE INDEX IF NOT EXISTS idx_heatwave_period ON heatwave_summary(year_period);
CREATE INDEX IF NOT EXISTS idx_heatwave_composite ON heatwave_summary(scenario, region_name, year_period);
