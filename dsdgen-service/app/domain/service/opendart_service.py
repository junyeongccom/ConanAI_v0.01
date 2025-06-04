from app.domain.repository.opendart_repository import OpenDartRepository
from typing import Optional

class OpenDartService:
    def __init__(self):
        self.repository = OpenDartRepository()

    def fetch_by_corp_code(self, corp_code: str, 
                          auto_extract: bool = True, delete_zip: bool = True,
                          bgn_de: str = "20250301", end_de: str = "20250415",
                          pblntf_ty: str = "A") -> Optional[str]:
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
            Optional[str]: 처리된 파일 경로 또는 접수번호를 찾지 못한 경우 None
            
        Raises:
            Exception: API 호출 오류 또는 처리 중 예외 발생 시
        """
        print(f"[INFO] 기업코드 '{corp_code}'로 접수번호 조회 시작")
        print(f"[INFO] 검색 기간: {bgn_de} ~ {end_de}")
        print(f"[INFO] 공시유형: {pblntf_ty}")
        
        # 1. 접수번호 조회 (업데이트된 메서드 호출)
        rcept_no = self.repository.get_document_info(
            corp_code=corp_code,
            bgn_de=bgn_de,
            end_de=end_de,
            pblntf_ty=pblntf_ty
        )
        
        if not rcept_no:
            print(f"[WARN] 접수번호를 찾을 수 없습니다. 기업코드: {corp_code}, 검색기간: {bgn_de}~{end_de}")
            return None
        
        print(f"[INFO] 접수번호 '{rcept_no}'로 XBRL 파일 다운로드 시작")
        
        # 2. 접수번호로 XBRL 파일 다운로드 (repository 직접 호출)
        # 보고서 코드는 파일명 형식을 위해 고정 값 "11011" 사용
        return self.repository.download_xbrl_zip(
            rcept_no=rcept_no,
            reprt_code="11011",  # 사업보고서 코드 고정
            auto_extract=auto_extract,
            delete_zip=delete_zip,
            corp_code=corp_code,
            bsns_year=None  # 폴더명 형식에 필요할 수 있으므로 None으로 전달
        )

    def download_corp_code_list(self, auto_extract: bool = True, delete_zip: bool = True) -> str:
        """
        OpenDART API를 통해 기업 코드 목록을 다운로드합니다.
        
        Args:
            auto_extract: 다운로드 후 자동으로 압축 해제할지 여부 (기본값: True)
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부 (기본값: True)
            
        Returns:
            str: 처리된 파일 경로 (압축 파일 또는 압축 해제된 디렉토리)
            
        Raises:
            Exception: API 호출 오류 또는 처리 중 예외 발생 시
        """
        print(f"[INFO] 기업 코드 목록 다운로드 시작")
        
        return self.repository.download_corp_code(
            auto_extract=auto_extract,
            delete_zip=delete_zip
        )
