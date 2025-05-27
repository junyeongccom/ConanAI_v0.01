from app.domain.service.opendart_service import OpenDartService
import asyncio
from typing import Optional, Dict, Any

class DocumentFetchController:
    def __init__(self):
        self.service = OpenDartService()

    async def fetch_by_corp_code(self, corp_code: str, 
                                      auto_extract: bool = True, delete_zip: bool = True,
                                      bgn_de: str = "20250301", end_de: str = "20250415",
                                      pblntf_ty: str = "A") -> Dict[str, Any]:
        """
        기업 코드를 기반으로 XBRL 파일을 다운로드하고 처리합니다.
        
        Args:
            corp_code: 기업 고유번호
            auto_extract: 다운로드 후 자동으로 압축 해제할지 여부 (기본값: True)
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부 (기본값: True)
            bgn_de: 검색 시작일(YYYYMMDD) (기본값: 20250301)
            end_de: 검색 종료일(YYYYMMDD) (기본값: 20250415)
            pblntf_ty: 공시유형 (기본값: "A", 전체)
            
        Returns:
            Dict[str, Any]: 처리 결과 정보를 포함하는 사전
        """
        loop = asyncio.get_event_loop()
        
        try:
            result = await loop.run_in_executor(
                None, 
                lambda: self.service.fetch_by_corp_code(
                    corp_code=corp_code, 
                    auto_extract=auto_extract, 
                    delete_zip=delete_zip,
                    bgn_de=bgn_de,
                    end_de=end_de,
                    pblntf_ty=pblntf_ty
                )
            )
            
            if result is None:
                return {
                    "status": "error",
                    "message": f"접수번호를 찾을 수 없습니다. 기업코드: {corp_code}, 검색기간: {bgn_de}~{end_de}",
                    "path": None
                }
            
            return {
                "status": "success",
                "file_type": "directory" if auto_extract else "zip",
                "path": result
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "path": None
            }

    async def download_corp_code_list(self, auto_extract: bool = True, delete_zip: bool = True) -> Dict[str, Any]:
        """
        OpenDART API를 통해 기업 코드 목록을 다운로드합니다.
        
        Args:
            auto_extract: 다운로드 후 자동으로 압축 해제할지 여부 (기본값: True)
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부 (기본값: True)
            
        Returns:
            Dict[str, Any]: 처리 결과 정보를 포함하는 사전
        """
        loop = asyncio.get_event_loop()
        
        try:
            result = await loop.run_in_executor(
                None, 
                lambda: self.service.download_corp_code_list(
                    auto_extract=auto_extract, 
                    delete_zip=delete_zip
                )
            )
            
            return {
                "status": "success",
                "file_type": "directory" if auto_extract else "zip",
                "path": result
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "path": None
            }
