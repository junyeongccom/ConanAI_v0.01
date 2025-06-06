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

SELECT 'Table heatwave_summary created successfully!' AS result; 