"""
XBRL 파싱 결과를 데이터베이스에 저장하는 리포지토리 모듈

이 모듈은 XBRL 파서에서 생성된 데이터프레임을 PostgreSQL 데이터베이스의 dsd_source 테이블에
저장하기 위한 함수와 유틸리티를 제공합니다.
"""

from typing import List, Dict, Any, Optional
import logging

from asyncpg.pool import Pool
from asyncpg.exceptions import UniqueViolationError, PostgresError

from app.foundation.db.asyncpg_pool import get_pool

# 로깅 설정
logger = logging.getLogger(__name__)


async def _ensure_unique_constraint(conn) -> bool:
    """
    dsd_source 테이블에 필요한 유니크 제약 조건이 존재하는지 확인하고, 없다면 추가합니다.
    
    Args:
        conn: asyncpg 커넥션 객체
        
    Returns:
        bool: 제약 조건 생성 성공 여부
    """
    try:
        # 테이블과 제약 조건의 존재 여부 확인
        exists_query = """
            SELECT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'unique_dsd_source_entry'
            );
        """
        exists = await conn.fetchval(exists_query)
        
        if not exists:
            logger.info("유니크 제약 조건 'unique_dsd_source_entry'가 존재하지 않아 생성합니다.")
            
            # 테이블 존재 여부 확인
            table_exists_query = """
                SELECT EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_name = 'dsd_source'
                );
            """
            table_exists = await conn.fetchval(table_exists_query)
            
            if not table_exists:
                logger.warning("테이블 'dsd_source'가 존재하지 않습니다. 테이블을 먼저 생성해야 합니다.")
                return False
            
            # 유니크 제약 조건 추가
            create_constraint_query = """
                ALTER TABLE dsd_source
                ADD CONSTRAINT unique_dsd_source_entry
                UNIQUE (corp_code, source_name, year);
            """
            await conn.execute(create_constraint_query)
            logger.info("유니크 제약 조건 'unique_dsd_source_entry'가 성공적으로 생성되었습니다.")
            return True
        else:
            logger.info("유니크 제약 조건 'unique_dsd_source_entry'가 이미 존재합니다.")
            return True
            
    except Exception as e:
        logger.error(f"유니크 제약 조건 확인/생성 중 오류 발생: {e}")
        return False


async def insert_dsd_source_bulk(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    XBRL 파싱 결과 레코드를 dsd_source 테이블에 대량으로 삽입합니다.
    
    이 함수는 DataFrame에서 변환된 레코드 리스트를 받아 PostgreSQL의 dsd_source 테이블에
    bulk insert를 수행합니다. 레코드의 (corp_code, source_name, year) 조합이 이미 존재하는 경우
    기존 값을 업데이트합니다.
    
    Args:
        records: XBRL 파싱 결과 레코드 리스트. 각 레코드는 다음 키를 포함해야 합니다:
                - corp_code: 기업 코드
                - 항목명: XBRL 항목 이름
                - 값: XBRL 항목 값 (문자열, 쉼표 등 포함 가능)
                - 연도: 연도 값
                - 단위: 단위 정보
    
    Returns:
        Dict[str, Any]: 처리 결과를 담은 딕셔너리
                - success: 성공 여부
                - inserted: 삽입된 레코드 수
                - updated: 업데이트된 레코드 수
                - error: 오류 메시지 (오류 발생 시)
    
    Raises:
        PostgresError: 데이터베이스 연결 또는 쿼리 실행 중 오류 발생 시
    """
    if not records:
        return {
            "success": True,
            "inserted": 0,
            "updated": 0,
            "message": "삽입할 레코드가 없습니다."
        }
    
    # 데이터 전처리
    processed_records = []
    for record in records:
        # XBRL 파서의 출력 형식에 맞춰 필드 이름 변환
        # '항목명'은 'source_name'으로, '값'은 숫자로, '연도'는 정수로 변환
        try:
            # 쉼표 제거 후 정수나 실수로 변환
            value_str = record.get('값', '0').replace(',', '')
            value = int(float(value_str)) if value_str else 0
            
            # 연도가 문자열인 경우 정수로 변환
            year_str = record.get('연도', '0')
            year = int(year_str) if year_str.isdigit() else 0
            
            processed_record = {
                'corp_code': record.get('기업코드', ''),
                'source_name': record.get('항목명', ''),
                'value': value,
                'year': year,
                'unit': record.get('단위', '')
            }
            processed_records.append(processed_record)
        except (ValueError, TypeError) as e:
            logger.warning(f"레코드 처리 중 오류 발생: {e}, record={record}")
            continue
    
    # 필수 필드 검증
    for idx, record in enumerate(processed_records):
        if not record['corp_code'] or not record['source_name'] or not record['year']:
            logger.warning(f"필수 필드 누락: record={record}")
            processed_records.pop(idx)
    
    if not processed_records:
        return {
            "success": False,
            "error": "유효한 레코드가 없습니다.",
            "inserted": 0,
            "updated": 0
        }
    
    # 데이터베이스 연결 및 쿼리 실행
    pool: Optional[Pool] = None
    inserted_count = 0
    updated_count = 0
    
    try:
        # 커넥션 풀 가져오기
        pool = await get_pool()
        
        # 비동기로 executemany 실행
        async with pool.acquire() as conn:
            # 트랜잭션 시작
            async with conn.transaction():
                # 유니크 제약 조건 확인 및 생성
                constraint_exists = await _ensure_unique_constraint(conn)
                
                # 레코드 수 카운트
                results = await conn.fetch(
                    "SELECT COUNT(*) FROM dsd_source"
                )
                before_count = results[0]['count']
                
                # 유니크 제약 조건이 존재하는 경우 ON CONFLICT 사용
                if constraint_exists:
                    # ON CONFLICT 구문을 사용한 UPSERT 쿼리
                    query = """
                        INSERT INTO dsd_source (corp_code, source_name, value, year, unit)
                        VALUES ($1, $2, $3, $4, $5)
                        ON CONFLICT (corp_code, source_name, year) 
                        DO UPDATE SET 
                            value = EXCLUDED.value,
                            unit = EXCLUDED.unit
                        RETURNING (xmax = 0) AS inserted
                    """
                    
                    # executemany 대신 복수의 VALUES를 생성하는 방식으로 구현 (asyncpg 특성)
                    stmt = await conn.prepare(query)
                    
                    # 각 레코드에 대해 쿼리 실행하고 삽입/업데이트 여부 추적
                    for record in processed_records:
                        result = await stmt.fetch(
                            record['corp_code'],
                            record['source_name'],
                            record['value'],
                            record['year'],
                            record['unit']
                        )
                        if result and result[0]['inserted']:
                            inserted_count += 1
                        else:
                            updated_count += 1
                else:
                    # 제약 조건이 없는 경우 더 느리지만 안전한 방식 사용
                    for record in processed_records:
                        # 먼저 레코드가 존재하는지 확인
                        check_query = """
                            SELECT id FROM dsd_source 
                            WHERE corp_code = $1 AND source_name = $2 AND year = $3
                        """
                        existing = await conn.fetchrow(
                            check_query,
                            record['corp_code'],
                            record['source_name'],
                            record['year']
                        )
                        
                        if existing:
                            # 기존 레코드 업데이트
                            update_query = """
                                UPDATE dsd_source
                                SET value = $1, unit = $2
                                WHERE id = $3
                            """
                            await conn.execute(
                                update_query,
                                record['value'],
                                record['unit'],
                                existing['id']
                            )
                            updated_count += 1
                        else:
                            # 새 레코드 삽입
                            insert_query = """
                                INSERT INTO dsd_source (corp_code, source_name, value, year, unit)
                                VALUES ($1, $2, $3, $4, $5)
                            """
                            await conn.execute(
                                insert_query,
                                record['corp_code'],
                                record['source_name'],
                                record['value'],
                                record['year'],
                                record['unit']
                            )
                            inserted_count += 1
                
                # 최종 레코드 수 확인
                results = await conn.fetch(
                    "SELECT COUNT(*) FROM dsd_source"
                )
                after_count = results[0]['count']
                
                # 확인용 로그
                logger.info(f"Bulk insert 완료: {inserted_count}개 삽입, {updated_count}개 업데이트")
        
        return {
            "success": True,
            "inserted": inserted_count,
            "updated": updated_count,
            "total_records": len(processed_records),
            "before_count": before_count,
            "after_count": after_count,
            "message": f"{inserted_count}개 레코드 삽입, {updated_count}개 레코드 업데이트 완료"
        }
        
    except UniqueViolationError as e:
        logger.error(f"중복 키 위반 오류: {e}")
        return {
            "success": False,
            "error": f"중복 키 위반 오류: {str(e)}",
            "inserted": inserted_count,
            "updated": updated_count
        }
    except PostgresError as e:
        logger.error(f"데이터베이스 오류: {e}")
        return {
            "success": False,
            "error": f"데이터베이스 오류: {str(e)}",
            "inserted": inserted_count,
            "updated": updated_count
        }
    except Exception as e:
        logger.error(f"예상치 못한 오류: {e}")
        return {
            "success": False,
            "error": f"예상치 못한 오류: {str(e)}",
            "inserted": inserted_count,
            "updated": updated_count
        }


async def get_dsd_source_by_corp_code(corp_code: str, year: Optional[int] = None) -> List[Dict[str, Any]]:
    """
    특정 기업 코드(및 선택적으로 연도)에 해당하는 dsd_source 데이터를 조회합니다.
    
    Args:
        corp_code: 조회할 기업 코드
        year: 선택적 연도 필터 (None인 경우 모든 연도 조회)
    
    Returns:
        List[Dict[str, Any]]: 조회된 레코드 리스트
    """
    try:
        pool = await get_pool()
        
        async with pool.acquire() as conn:
            if year:
                query = """
                    SELECT * FROM dsd_source 
                    WHERE corp_code = $1 AND year = $2
                    ORDER BY source_name, year
                """
                rows = await conn.fetch(query, corp_code, year)
            else:
                query = """
                    SELECT * FROM dsd_source 
                    WHERE corp_code = $1
                    ORDER BY source_name, year
                """
                rows = await conn.fetch(query, corp_code)
            
            # 결과를 딕셔너리 리스트로 변환
            return [dict(row) for row in rows]
            
    except Exception as e:
        logger.error(f"데이터 조회 중 오류 발생: {e}")
        return []
