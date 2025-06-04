from typing import Dict, List, Any, Optional
from fastapi import UploadFile, HTTPException
from app.domain.service.xsldsd_service import xsldsd_service


class XslDsdController:
    def __init__(self):
        self.service = xsldsd_service
    
    async def upload_excel_file(self, file: UploadFile, sheet_names: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        엑셀 파일 업로드 및 JSON 변환 처리
        
        Args:
            file: 업로드된 엑셀 파일
            sheet_names: 변환할 특정 시트 이름 목록
            
        Returns:
            Dict[str, Any]: 파일 정보와 변환된 JSON 데이터
        """
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Excel 파일만 업로드 가능합니다.")
        
        result = await self.service.save_uploaded_excel_file(file, sheet_names)
        return result


# 싱글톤 인스턴스
xsldsd_controller = XslDsdController()
