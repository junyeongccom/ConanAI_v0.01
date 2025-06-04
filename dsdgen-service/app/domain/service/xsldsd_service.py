import os
import shutil
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import UploadFile
from app.foundation.xslx_json import XlsxJsonConverter

UPLOAD_DIR = "uploads"

class XslDsdService:
    def __init__(self):
        os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    async def save_uploaded_excel_file(self, file: UploadFile, sheet_names: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        업로드된 엑셀 파일을 저장하고 JSON으로 변환하여 반환
        
        Args:
            file: 업로드된 엑셀 파일
            sheet_names: 변환할 특정 시트 이름 목록
        
        Returns:
            dict: 파일 정보와 변환된 JSON 데이터
        """
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        filename = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # 파일 저장
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 엑셀 파일을 JSON으로 변환
        result = XlsxJsonConverter.convert_file(filepath, sheet_names)
        
        # 디버깅 정보 추가
        print(f"File saved to: {filepath}")
        print(f"Sheet names: {sheet_names}")
        print(f"Conversion result keys: {result.keys()}")
        
        # 변환된 데이터 샘플을 로그에 출력 (최대 50줄)
        try:
            if 'sheets' in result and result['sheets']:
                print(f"\n===== 변환 결과 샘플 =====")
                for sheet_name, data in result['sheets'].items():
                    print(f"\n[시트: {sheet_name}]")
                    if isinstance(data, list) and data:
                        # 최대 5개 레코드만 출력
                        sample_size = min(5, len(data))
                        data_sample = data[:sample_size]
                        
                        # 각 레코드를 보기 좋게 출력
                        for i, record in enumerate(data_sample, 1):
                            print(f"  레코드 {i}:")
                            # 각 레코드의 내용을 줄바꿈으로 구분하여 출력
                            record_str = json.dumps(record, ensure_ascii=False, indent=2)
                            # 줄바꿈마다 들여쓰기 추가
                            formatted_record = '\n    '.join(record_str.split('\n'))
                            print(f"    {formatted_record}")
                        
                        # 데이터가 더 있는 경우 메시지 출력
                        if len(data) > sample_size:
                            print(f"  ... 외 {len(data) - sample_size}개 레코드")
                    else:
                        print("  데이터가 없거나 유효하지 않음")
                print("===== 샘플 끝 =====\n")
        except Exception as e:
            print(f"변환 결과 출력 중 오류 발생: {str(e)}")
        
        return result


# 싱글톤 인스턴스
xsldsd_service = XslDsdService()
