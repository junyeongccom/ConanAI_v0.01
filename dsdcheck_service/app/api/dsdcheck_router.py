from fastapi import APIRouter, Query, HTTPException, UploadFile, File, Form
from app.domain.controller.dsdcheck_controller import DsdCheckController
from app.domain.model.dsdcheck_schema import FinancialDataResponse, FinancialExcelResponse, ComparisonResult

router = APIRouter()
controller = DsdCheckController()

@router.get("/health")
async def health_check():
    return {"message": "Hello World from dsdcheck_service"}

@router.get("/financial-data", response_model=FinancialDataResponse)
async def get_financial_data(
    corp_name: str = Query(..., description="기업명 (예: LG화학)", min_length=1),
    year: int = Query(..., description="사업연도 (예: 2024)", ge=2000, le=2030)
):
    """
    기업의 연결(CFS) 및 별도(OFS) 재무제표를 모두 조회합니다.
    
    - **corp_name**: 기업명 (예: "LG화학", "삼성전자")
    - **year**: 사업연도 (예: 2024, 2023) - 2000년부터 2030년까지
    
    ## 응답 데이터 구조:
    - **statements**: 재무제표 리스트
      - **fs_div**: CFS(연결) 또는 OFS(별도)
      - **sj_div**: BS(재무상태표), IS(손익계산서), CIS(포괄손익계산서), CF(현금흐름표), SCE(자본변동표)
      - **items**: 계정 항목 리스트
        - **account_nm**: 계정명
        - **account_id**: 계정ID
        - **thstrm_amount**: 당기금액
        - **frmtrm_amount**: 전기금액
    
    ## 처리 과정:
    1. 기업명 → 기업코드 조회 (CORPCODE.xml)
    2. DART OpenAPI 호출 (연결/별도 각각)
    3. 데이터 전처리 및 구조화
    4. 유효성 검증 후 반환
    """
    # 입력값 정규화
    corp_name = corp_name.strip()
    
    # 컨트롤러 호출
    response = await controller.get_financial_data(corp_name, year)
    
    # 결과 검증 및 예외 처리
    if not response:
        raise HTTPException(
            status_code=404,
            detail=f"기업명 '{corp_name}'의 {year}년도 재무제표를 찾을 수 없습니다."
        )
    
    return response

@router.post("/upload", response_model=FinancialExcelResponse)
async def upload_excel_file(
    file: UploadFile = File(..., description="재무제표 엑셀 파일")
):
    """
    업로드된 엑셀 파일에서 재무제표 데이터를 추출하고 전처리합니다.
    
    - **file**: 재무제표 엑셀 파일 (.xlsx 형식)
    
    ## 처리 과정:
    1. Index 시트에서 재무제표 구분 정보 추출
    2. 각 시트별로 데이터 파싱 (계정명, 당기/전기 금액)
    3. fs_div(CFS/OFS), sj_div(BS/IS/CIS/CF/SCE) 매핑
    4. 숫자 데이터 정규화 (쉼표 제거)
    
    ## 응답 데이터 구조:
    - **statements**: 파싱된 재무제표 리스트
      - **fs_div**: CFS(연결) 또는 OFS(별도)
      - **sj_div**: BS(재무상태표), IS(손익계산서), CIS(포괄손익계산서), CF(현금흐름표), SCE(자본변동표)
      - **items**: 계정 항목 리스트
        - **account_nm**: 계정명
        - **thstrm_amount**: 당기금액 (전기)
        - **frmtrm_amount**: 전기금액 (전전기)
    """
    # 파일 형식 검증
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=400,
            detail="엑셀 파일(.xlsx 또는 .xls)만 업로드 가능합니다."
        )
    
    # 컨트롤러 호출
    response = await controller.upload_excel_file(file)
    
    # 결과 검증 및 예외 처리
    if not response:
        raise HTTPException(
            status_code=400,
            detail="엑셀 파일에서 재무제표 데이터를 추출할 수 없습니다. 파일 형식을 확인해주세요."
        )
    
    return response

@router.post("/compare", response_model=list[ComparisonResult])
async def compare_excel_and_dart(
    file: UploadFile = File(...),
    corp_name: str = Form(...),
    year: int = Form(...)
):
    return await controller.compare_excel_to_dart(file, corp_name, year)


