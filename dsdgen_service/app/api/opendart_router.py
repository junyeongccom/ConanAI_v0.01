from fastapi import APIRouter, Query
from app.domain.controller.opendart_controller import DocumentFetchController
from typing import Dict, Any, Optional

router = APIRouter(prefix="/opendart", tags=["OPEN DART"])
controller = DocumentFetchController()

@router.get("/fetch-by-corp")
async def fetch_by_corp_code(
    corp_code: str = Query(..., description="기업 고유번호 (8자리)"),
    auto_extract: bool = Query(True, description="다운로드 후 자동으로 압축 해제할지 여부"),
    delete_zip: bool = Query(True, description="압축 해제 후 원본 ZIP 파일을 삭제할지 여부"),
    bgn_de: str = Query("20250301", description="검색 시작일(YYYYMMDD) (기본값: 20250301)"),
    end_de: str = Query("20250415", description="검색 종료일(YYYYMMDD) (기본값: 20250415)"),
    pblntf_ty: str = Query("A", description="공시유형 (기본값: 'A', 전체)")
) -> Dict[str, Any]:
    """
    기업 고유번호를 기반으로 OpenDART에서 XBRL 파일을 다운로드하고 처리합니다.
    
    1. 기업코드와 검색 기간으로 접수번호(rcept_no)를 조회합니다.
       - 기본 검색 기간은 20250301~20250415입니다.
       - 필요시 bgn_de, end_de로 검색 기간을 직접 지정할 수 있습니다.
       - pblntf_ty로 공시유형을 지정할 수 있습니다. ('A': 전체, 'D': 정기공시, 'B': 주요사항보고, 'F': 감사보고서)
    2. 조회된 접수번호로 XBRL 파일을 다운로드합니다.
    
    - auto_extract=True: 압축 해제하여 디렉토리로 저장
    - delete_zip=True: 압축 해제 후 원본 ZIP 삭제
    """
    return await controller.fetch_by_corp_code(
        corp_code=corp_code,
        auto_extract=auto_extract, 
        delete_zip=delete_zip,
        bgn_de=bgn_de,
        end_de=end_de,
        pblntf_ty=pblntf_ty
    )

@router.get("/corp-code")
async def download_corp_code(
    auto_extract: bool = Query(True, description="다운로드 후 자동으로 압축 해제할지 여부"),
    delete_zip: bool = Query(True, description="압축 해제 후 원본 ZIP 파일을 삭제할지 여부")
) -> Dict[str, Any]:
    """
    OpenDART API를 통해 전체 기업 코드 목록을 다운로드합니다.
    
    이 API는 https://opendart.fss.or.kr/api/corpCode.xml 에 접속하여 
    DART에 등록된 전체 기업의 정보가 담긴 ZIP 파일을 다운로드합니다.
    
    다운로드된 ZIP 파일에는 CORPCODE.xml 파일이 포함되어 있으며,
    이 파일은 기업 고유번호, 기업명, 종목코드 등의 정보를 담고 있습니다.
    
    - auto_extract=True: 압축 해제하여 디렉토리로 저장
    - delete_zip=True: 압축 해제 후 원본 ZIP 삭제
    """
    return await controller.download_corp_code_list(
        auto_extract=auto_extract,
        delete_zip=delete_zip
    )