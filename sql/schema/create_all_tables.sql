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

-- 2. issb_s2_disclosure Table (ISSB S2 지표 정보)
CREATE TABLE IF NOT EXISTS issb_s2_disclosure (
    disclosure_id SERIAL PRIMARY KEY, -- INT 대신 SERIAL 사용 (자동 증가)
    section VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    topic VARCHAR(255), -- Nullable
    disclosure_ko TEXT NOT NULL,
    disclosure_en TEXT, -- Nullable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. issb_s2_requirement Table (S2 지표별 요구사항)
CREATE TABLE IF NOT EXISTS issb_s2_requirement (
    requirement_id SERIAL PRIMARY KEY, -- INT 대신 SERIAL 사용 (자동 증가)
    disclosure_id INT NOT NULL,
    requirement_order INT NOT NULL,
    requirement_text_ko TEXT NOT NULL,
    data_required_type VARCHAR(50) NOT NULL,
    input_placeholder_ko TEXT, -- Nullable
    input_guidance_ko TEXT, -- Nullable
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_disclosure
        FOREIGN KEY (disclosure_id)
        REFERENCES issb_s2_disclosure(disclosure_id)
        ON DELETE CASCADE -- 연관된 disclosure 삭제 시 requirement도 삭제
);

-- 4. answer Table (사용자별 요구사항 응답 데이터)
CREATE TABLE IF NOT EXISTS answer (
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- UUID 기본값 설정
    user_id UUID NOT NULL, -- user_id가 UUID일 경우 UUID 타입으로 변경
    requirement_id INT NOT NULL,
    answer_value_text TEXT,
    answer_value_number DECIMAL(18, 4),
    answer_value_boolean BOOLEAN,
    answer_value_location VARCHAR(255),
    answer_value_financial_impact DECIMAL(18, 4),
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_edited_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE CASCADE, -- 연관된 user 삭제 시 answer도 삭제
    CONSTRAINT fk_requirement
        FOREIGN KEY (requirement_id)
        REFERENCES issb_s2_requirement(requirement_id)
        ON DELETE CASCADE, -- 연관된 requirement 삭제 시 answer도 삭제
    CONSTRAINT uq_user_requirement UNIQUE (user_id, requirement_id) -- 한 사용자는 한 요구사항에 대해 하나의 응답만 가질 수 있도록 (또는 업데이트되도록)
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

-- 샘플 데이터 조회 쿼리 예시
/*
-- 특정 지역의 모든 시나리오 조회
SELECT * FROM heatwave_summary
WHERE region_name = '경기도'
ORDER BY scenario, year_period;

-- 특정 시나리오의 모든 지역 조회
SELECT * FROM heatwave_summary
WHERE scenario = 'SSP5-8.5'
ORDER BY region_name, year_period;

-- 변화율이 높은 상위 10개 지역-시나리오 조합
SELECT scenario, region_name, year_period, change_rate
FROM heatwave_summary
WHERE year_period = '2050' AND change_rate IS NOT NULL
ORDER BY change_rate DESC
LIMIT 10;
*/

-- SELECT 'All tables created successfully!' AS result;