from app.foundation.xbrl_parser.xbrl_parser import XBRLParser
import pandas as pd
from app.domain.repository.xbrl_parser_repository import insert_dsd_source_bulk

class XBRLParserService:
    def __init__(self):
        """
        XBRLParserService 초기화
        """
        self.parser = XBRLParser()

    async def get_xbrl_to_dataframe(self, corp_code: str) -> pd.DataFrame:
        """
        기업 고유번호를 기반으로 XBRL 데이터를 파싱하여 DataFrame으로 변환합니다.
        파싱된 데이터는 데이터베이스에도 저장됩니다.
        
        Args:
            corp_code: 기업 고유번호 (예: 00000000)
            
        Returns:
            pandas.DataFrame: XBRL 데이터프레임 (기업코드, 항목명, 값, 연도, 단위 포함)
            
        Raises:
            Exception: 데이터프레임 추출 또는 데이터베이스 저장 중 오류 발생 시
        """
        print(f"[INFO] 기업 고유번호 {corp_code}에 대한 XBRL 데이터프레임 추출 시작...")
        
        try:
            # XBRLParser를 통해 XBRL 데이터프레임 추출 (비동기 호출)
            df = await self.parser.extract_xbrl_to_dataframe(corp_code)
            print(f"[INFO] 데이터프레임 추출 성공! 총 {len(df)}개 항목")
            
            # 데이터프레임이 비어있지 않다면 DB에 저장
            if not df.empty:
                # DataFrame을 레코드 리스트로 변환
                records = df.to_dict(orient="records")
                
                # 비동기 함수 직접 호출 (await 사용)
                db_result = await insert_dsd_source_bulk(records)
                
                # 저장 결과 로깅
                if db_result.get("success", False):
                    print(f"[INFO] 데이터베이스 저장 성공: {db_result.get('inserted', 0)}개 레코드 삽입, "
                          f"{db_result.get('updated', 0)}개 레코드 업데이트")
                else:
                    print(f"[WARN] 데이터베이스 저장 실패: {db_result.get('error', '알 수 없는 오류')}")
            
            # DataFrame 반환 (원래 기능 유지)
            return df
            
        except Exception as e:
            print(f"[ERROR] 데이터프레임 추출 중 오류 발생: {e}")
            # 오류 발생 시 빈 DataFrame 반환
            return pd.DataFrame()
            
