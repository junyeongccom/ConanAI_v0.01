import os
import requests
import zipfile
import json
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict, Any, Optional, List

load_dotenv()
API_KEY = os.getenv("DART_API_KEY")
SAVE_DIR = Path("/app/app/dart_documents")
EXTRACT_DIR = SAVE_DIR / "extracted"

class OpenDartRepository:
    def __init__(self):
        self.api_key = API_KEY
        self.save_dir = SAVE_DIR
        self.extract_dir = EXTRACT_DIR
        self.save_dir.mkdir(parents=True, exist_ok=True)
        self.extract_dir.mkdir(parents=True, exist_ok=True)
        # API 키 확인 로깅
        print(f"[INFO] API Key 설정됨: {'*' * 5}{API_KEY[-5:] if API_KEY else 'NOT SET'}")
        print(f"[INFO] 저장 경로: {self.save_dir}")
        print(f"[INFO] 압축 해제 경로: {self.extract_dir}")

    def get_document_info(self, corp_code: str, bsns_year: int = None, reprt_code: str = None, 
                        bgn_de: str = None, end_de: str = None, pblntf_ty: str = "A") -> Optional[str]:
        """
        OpenDART API를 통해 지정된 기업 코드에 해당하는 사업보고서의 접수번호(rcept_no)를 조회합니다.
        
        Args:
            corp_code: 기업 고유번호
            bsns_year: (더 이상 사용되지 않음) 사업연도  
            reprt_code: (더 이상 사용되지 않음) 보고서 코드
            bgn_de: 검색 시작일(YYYYMMDD) (기본값: 당해년도 3월 1일)
            end_de: 검색 종료일(YYYYMMDD) (기본값: 당해년도 4월 15일)
            pblntf_ty: 공시유형 (기본값: "A", 전체)
            
        Returns:
            str: 조회된 접수번호(rcept_no) 또는 찾지 못한 경우 None
            
        Raises:
            Exception: API 호출 실패 시 예외 발생
        """
        # 검색 시작일과 종료일 기본값 설정
        if not bgn_de:
            current_year = datetime.now().year
            bgn_de = f"{current_year}0301"  # 당해년도 3월 1일
        
        if not end_de:
            current_year = datetime.now().year
            end_de = f"{current_year}0415"  # 당해년도 4월 15일
            
        # list.json API 호출로 변경
        url = "https://opendart.fss.or.kr/api/list.json"
        params = {
            "crtfc_key": self.api_key,
            "corp_code": corp_code,
            "bgn_de": bgn_de,
            "end_de": end_de,
            "pblntf_ty": pblntf_ty
        }
        
        print(f"[INFO] 문서 검색 API 요청: {url}, 파라미터: {params}")
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # HTTP 오류 검사
            
            # 응답 로깅
            print(f"[INFO] 응답 상태 코드: {response.status_code}")
            print(f"[INFO] 응답 콘텐츠 타입: {response.headers.get('Content-Type', '')}")
            
            # JSON 응답 파싱
            response_data = response.json()
            
            # 응답 상태 확인
            status = response_data.get('status')
            if status != '000':
                message = response_data.get('message', 'Unknown error')
                print(f"[ERROR] API 응답 오류: {message}")
                return None
                
            # 목록 데이터 확인
            list_data = response_data.get('list', [])
            if not list_data:
                print(f"[WARN] 검색 결과가 없습니다. corp_code: {corp_code}")
                return None
                
            # "사업보고서"가 포함된 항목 찾기
            for item in list_data:
                report_nm = item.get('report_nm', '')
                rcept_no = item.get('rcept_no')
                
                # 디버그 정보 출력
                print(f"[DEBUG] 검색된 보고서: {report_nm}, 접수번호: {rcept_no}")
                
                if '사업보고서' in report_nm and rcept_no:
                    print(f"[INFO] 사업보고서 접수번호 검색 성공: {rcept_no}, 보고서명: {report_nm}")
                    return rcept_no
            
            # 사업보고서가 없는 경우
            print(f"[WARN] '사업보고서'가 포함된 항목을 찾을 수 없습니다. corp_code: {corp_code}")
            
            # 대체: 목록의 첫 번째 항목 반환
            if list_data and 'rcept_no' in list_data[0]:
                rcept_no = list_data[0]['rcept_no']
                print(f"[INFO] 대체 접수번호 사용: {rcept_no}, 보고서명: {list_data[0].get('report_nm', '알 수 없음')}")
                return rcept_no
                
            return None
                
        except requests.RequestException as e:
            print(f"[ERROR] 문서 검색 API 요청 오류: {e}")
            raise Exception(f"OpenDART API 요청 오류: {e}")
        except json.JSONDecodeError as e:
            print(f"[ERROR] JSON 응답 파싱 오류: {e}")
            print(f"[DEBUG] 응답 내용: {response.text[:500]}...")
            raise Exception(f"OpenDART API 응답 파싱 오류: {e}")
        except Exception as e:
            print(f"[ERROR] 문서 정보 조회 중 예상치 못한 오류: {e}")
            raise

    def download_xbrl_zip(self, rcept_no: str, reprt_code: str = "11011", filename: str = None, auto_extract: bool = True, delete_zip: bool = False, 
                         corp_code: str = None, bsns_year: int = None) -> str:
        """
        OpenDART에서 지정된 접수번호(rcept_no)의 XBRL zip 파일을 다운로드하고 저장함
        
        Args:
            rcept_no: 접수번호
            reprt_code: 보고서 코드 (기본값: 11011, 사업보고서)
            filename: 저장할 파일명 (기본값: None, 자동 생성)
            auto_extract: 다운로드 후 자동으로 압축 해제할지 여부
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부
            corp_code: 기업 고유번호 (폴더명에 사용)
            bsns_year: 사업연도 (폴더명에 사용)
            
        Returns:
            str: 처리된 파일 또는 디렉토리 경로
            
        Raises:
            Exception: API 호출 실패 또는 파일 처리 오류 시 예외 발생
        """
        url = "https://opendart.fss.or.kr/api/fnlttXbrl.xml"
        params = {
            "crtfc_key": self.api_key,
            "rcept_no": rcept_no,
            "reprt_code": reprt_code
        }

        print(f"[INFO] XBRL 다운로드 API 요청: {url}, 파라미터: {params}")

        try:
            response = requests.get(url, params=params, stream=True)
            response.raise_for_status()  # HTTP 오류 검사
            
            content_type = response.headers.get("Content-Type", "")
            
            # 모든 응답 정보 로깅
            debug_msg = (
                f"[DEBUG] 응답 정보\n"
                f"- 상태 코드: {response.status_code}\n"
                f"- 응답 타입: {content_type}\n"
                f"- 헤더: {response.headers}\n"
                f"- 데이터 크기: {len(response.content)} bytes\n"
                f"- 응답 시작 부분: {response.content[:100]}"
            )
            print(debug_msg)
            
            # XML 응답이면 오류 메시지 확인
            if 'xml' in content_type.lower():
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(response.content, 'xml')
                error = soup.find('status')
                if error:
                    message = soup.find('message')
                    error_msg = message.text if message else "Unknown error"
                    print(f"[ERROR] API 응답 오류: {error_msg}")
                    raise Exception(f"OpenDART API 오류: {error_msg}")
                print(f"[WARN] XML 응답을 받았으나 오류가 아닙니다. 콘텐츠 확인 필요")
            
            # ZIP 파일인지 확인 (content-type이 application/zip이 아니더라도 ZIP 파일일 수 있음)
            if response.content[:4] != b'PK\x03\x04':
                print(f"[ERROR] 응답이 ZIP 파일 형식이 아닙니다.")
                raise Exception("다운로드한 파일이 ZIP 형식이 아닙니다.")

            if filename is None:
                filename = f"{rcept_no}_{reprt_code}.zip"

            save_path = self.save_dir / filename
            with open(save_path, "wb") as f:
                f.write(response.content)

            print(f"[INFO] 파일 저장 완료: {save_path}")
            
            # 압축 해제 진행
            extract_path = None
            if auto_extract:
                extract_path = self._extract_zip_file(save_path, delete_zip, corp_code, bsns_year, reprt_code)
                return extract_path
            
            return str(save_path)
            
        except requests.RequestException as e:
            print(f"[ERROR] XBRL 다운로드 API 요청 오류: {e}")
            raise Exception(f"OpenDART API 요청 오류: {e}")
        except Exception as e:
            print(f"[ERROR] XBRL 파일 다운로드 중 오류: {e}")
            raise
    
    def _extract_zip_file(self, zip_path: Path, delete_zip: bool = False, 
                         corp_code: str = None, bsns_year: int = None, reprt_code: str = None) -> str:
        """
        ZIP 파일을 압축 해제하고 추출된 파일 경로를 반환
        
        Args:
            zip_path: ZIP 파일 경로
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부
            corp_code: 기업 고유번호 (폴더명에 사용)
            bsns_year: 사업연도 (폴더명에 사용, 없을 경우 날짜 사용)
            reprt_code: 보고서 코드 (폴더명에 사용)
            
        Returns:
            str: 압축 해제된 디렉토리 경로
            
        Raises:
            FileNotFoundError: ZIP 파일이 존재하지 않는 경우
            Exception: 압축 해제 중 오류 발생 시
        """
        if not zip_path.exists():
            raise FileNotFoundError(f"ZIP 파일이 존재하지 않습니다: {zip_path}")
        
        # 압축 해제할 디렉토리 생성
        if corp_code and reprt_code:
            # 새로운 형식: '기업 고유번호_현재날짜_보고서코드' 또는 '기업 고유번호_사업연도_보고서코드'
            if bsns_year:
                extract_folder = f"{corp_code}_{bsns_year}_{reprt_code}"
            else:
                # 사업연도가 없는 경우 접수번호(ZIP 파일명)를 사용
                extract_folder = f"{corp_code}_{zip_path.stem}"
                
            print(f"[INFO] 새 폴더명 형식으로 저장: {extract_folder}")
        else:
            # 기존 형식: '접수번호_보고서코드' (.zip 확장자 제외)
            extract_folder = zip_path.stem
            print(f"[INFO] 기존 폴더명 형식으로 저장: {extract_folder}")
            
        extract_dir = self.extract_dir / extract_folder
        extract_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            # 압축 해제
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            
            print(f"[INFO] 압축 해제 완료: {extract_dir}")
            
            # 압축 해제 후 원본 ZIP 파일 삭제 옵션이 활성화된 경우
            if delete_zip:
                os.remove(zip_path)
                print(f"[INFO] 원본 ZIP 파일 삭제 완료: {zip_path}")
            
            # 추출된 파일 목록 확인
            extracted_files = list(extract_dir.glob("*"))
            print(f"[INFO] 추출된 파일 수: {len(extracted_files)}")
            
            return str(extract_dir)
            
        except Exception as e:
            print(f"[ERROR] 압축 해제 중 오류 발생: {e}")
            raise

    def download_corp_code(self, auto_extract: bool = True, delete_zip: bool = False) -> str:
        """
        OpenDART에서 기업 코드 목록을 다운로드합니다.
        
        Args:
            auto_extract: 다운로드 후 자동으로 압축 해제할지 여부
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부
            
        Returns:
            str: 저장된 압축 파일 경로 또는 압축 해제된 경우 디렉토리 경로
            
        Raises:
            Exception: API 호출 실패 또는 파일 처리 오류 시 예외 발생
        """
        url = "https://opendart.fss.or.kr/api/corpCode.xml"
        params = {
            "crtfc_key": self.api_key
        }

        print(f"[INFO] 기업코드 다운로드 API 요청: {url}")

        try:
            response = requests.get(url, params=params, stream=True)
            response.raise_for_status()  # HTTP 오류 검사
            
            content_type = response.headers.get("Content-Type", "")
            
            # 응답 정보 로깅
            debug_msg = (
                f"[DEBUG] 응답 정보\n"
                f"- 상태 코드: {response.status_code}\n"
                f"- 응답 타입: {content_type}\n"
                f"- 헤더: {response.headers}\n"
                f"- 데이터 크기: {len(response.content)} bytes"
            )
            print(debug_msg)
            
            # XML 응답이면 오류 메시지 확인
            if 'xml' in content_type.lower() and not 'zip' in content_type.lower():
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(response.content, 'xml')
                error = soup.find('status')
                if error:
                    message = soup.find('message')
                    error_msg = message.text if message else "Unknown error"
                    print(f"[ERROR] API 응답 오류: {error_msg}")
                    raise Exception(f"OpenDART API 오류: {error_msg}")
                print(f"[WARN] XML 응답을 받았으나 오류가 아닙니다. 콘텐츠 확인 필요")
            
            # ZIP 파일인지 확인
            if response.content[:4] != b'PK\x03\x04':
                print(f"[ERROR] 응답이 ZIP 파일 형식이 아닙니다.")
                raise Exception("다운로드한 파일이 ZIP 형식이 아닙니다.")

            # 저장할 파일명 생성
            filename = f"corpcode_{datetime.now().strftime('%Y%m%d')}.zip"
            save_path = self.save_dir / filename
            
            with open(save_path, "wb") as f:
                f.write(response.content)

            print(f"[INFO] 기업코드 파일 저장 완료: {save_path}")
            
            # 압축 해제 진행
            extract_path = None
            if auto_extract:
                extract_path = self._extract_corp_code_zip(save_path, delete_zip)
                return extract_path
            
            return str(save_path)
            
        except requests.RequestException as e:
            print(f"[ERROR] 기업코드 다운로드 API 요청 오류: {e}")
            raise Exception(f"OpenDART API 요청 오류: {e}")
        except Exception as e:
            print(f"[ERROR] 기업코드 파일 다운로드 중 오류: {e}")
            raise
            
    def _extract_corp_code_zip(self, zip_path: Path, delete_zip: bool = False) -> str:
        """
        기업코드 ZIP 파일을 압축 해제하고 추출된 파일 경로를 반환
        
        Args:
            zip_path: ZIP 파일 경로
            delete_zip: 압축 해제 후 원본 ZIP 파일을 삭제할지 여부
            
        Returns:
            str: 압축 해제된 디렉토리 경로
            
        Raises:
            FileNotFoundError: ZIP 파일이 존재하지 않는 경우
            Exception: 압축 해제 중 오류 발생 시
        """
        if not zip_path.exists():
            raise FileNotFoundError(f"ZIP 파일이 존재하지 않습니다: {zip_path}")
        
        # 압축 해제할 디렉토리 생성
        extract_folder = f"corpcode_{datetime.now().strftime('%Y%m%d')}"
        extract_dir = self.extract_dir / extract_folder
        extract_dir.mkdir(parents=True, exist_ok=True)
        
        try:
            # 압축 해제
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            
            print(f"[INFO] 기업코드 압축 해제 완료: {extract_dir}")
            
            # 압축 해제 후 원본 ZIP 파일 삭제 옵션이 활성화된 경우
            if delete_zip:
                os.remove(zip_path)
                print(f"[INFO] 원본 ZIP 파일 삭제 완료: {zip_path}")
            
            # 추출된 파일 목록 확인
            extracted_files = list(extract_dir.glob("*"))
            print(f"[INFO] 추출된 파일 수: {len(extracted_files)}")
            
            return str(extract_dir)
            
        except Exception as e:
            print(f"[ERROR] 압축 해제 중 오류 발생: {e}")
            raise