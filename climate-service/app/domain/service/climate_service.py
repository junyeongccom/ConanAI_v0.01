"""
기후 데이터 전처리 서비스
"""

import os
from fastapi import HTTPException

from app.foundation.preprocess_heatwave_data import (
    process_heatwave_csv, 
    process_multiple_heatwave_files,
    get_heatwave_summary
)
from app.domain.repository.climate_repository import ClimateRepository
from app.domain.model.climate_schema import (
    PreprocessRequest,
    PreprocessResponse,
    FileProcessingStatus
)


class ClimateService:
    """기후 데이터 전처리 서비스"""
    
    def __init__(self):
        self.climate_repository = ClimateRepository()
    
    async def preprocess_single_file(self, request: PreprocessRequest) -> PreprocessResponse:
        """단일 파일 전처리 및 DB 저장"""
        try:
            print(f"🔍 서비스: 파일 경로 확인 시작 - {request.file_name}")
            file_path = f"app/platform/data/{request.file_name}"
            print(f"📂 생성된 파일 경로: {file_path}")
            print(f"📁 파일 존재 여부: {os.path.exists(file_path)}")
            
            # 디렉토리 내 실제 파일 목록 출력
            data_dir = "app/platform/data"
            actual_file_path = None
            
            if os.path.exists(data_dir):
                actual_files = os.listdir(data_dir)
                print(f"📋 실제 디렉토리 파일 목록: {actual_files}")
                
                # 요청된 파일이 정확히 없으면 유사한 파일명 찾기
                if not os.path.exists(file_path):
                    print(f"🔍 정확한 파일명이 없어서 유사한 파일 검색 중...")
                    
                    # 공백이나 특수문자 차이를 무시하고 유사한 파일 찾기
                    requested_name_clean = request.file_name.replace(" ", "").replace("　", "")
                    
                    for file in actual_files:
                        file_clean = file.replace(" ", "").replace("　", "")
                        if file_clean == requested_name_clean:
                            actual_file_path = os.path.join(data_dir, file)
                            print(f"✅ 유사한 파일 발견: {file}")
                            break
                    
                    if actual_file_path:
                        file_path = actual_file_path
                    else:
                        print(f"❌ 유사한 파일도 찾을 수 없음")
                else:
                    actual_file_path = file_path
                    
            else:
                print(f"❌ 데이터 디렉토리가 존재하지 않음: {data_dir}")
            
            if not actual_file_path or not os.path.exists(file_path):
                raise HTTPException(
                    status_code=404, 
                    detail=f"파일을 찾을 수 없습니다: {request.file_name}"
                )
            
            print(f"📍 최종 사용할 파일 경로: {file_path}")
            print("⚙️ 서비스: 전처리 함수 호출 시작")
            # 전처리 실행
            result_df = process_heatwave_csv(file_path)
            summary = get_heatwave_summary(result_df)
            
            print("💾 서비스: DB 저장 시작")
            # DB에 저장
            await self.climate_repository.save_heatwave_data(result_df)
            
            print("✅ 서비스: 처리 완료")
            return PreprocessResponse(
                status=FileProcessingStatus.SUCCESS,
                message=f"전처리 및 DB 저장 완료: {len(result_df)}행 처리됨",
                summary=summary,
                data=result_df.to_dict(orient="records")[:10]  # 처음 10행만 반환
            )
            
        except Exception as e:
            print(f"❌ 서비스: 오류 발생 - {str(e)}")
            print(f"🔍 오류 타입: {type(e).__name__}")
            raise HTTPException(
                status_code=500,
                detail=f"전처리 실패: {str(e)}"
            )
    
    async def preprocess_all_files(self) -> PreprocessResponse:
        """전체 파일 일괄 전처리 및 DB 저장"""
        try:
            print("🔍 서비스: 디렉토리 확인 시작")
            data_dir = "app/platform/data"
            
            if not os.path.exists(data_dir):
                raise HTTPException(
                    status_code=404,
                    detail=f"데이터 디렉토리를 찾을 수 없습니다: {data_dir}"
                )
            
            print("⚙️ 서비스: 일괄 전처리 시작")
            # 일괄 전처리 실행
            combined_df = process_multiple_heatwave_files(data_dir)
            summary = get_heatwave_summary(combined_df)
            
            print("💾 서비스: 일괄 DB 저장 시작")
            # DB에 저장
            await self.climate_repository.save_heatwave_data(combined_df)
            
            print("✅ 서비스: 일괄 처리 완료")
            return PreprocessResponse(
                status=FileProcessingStatus.SUCCESS,
                message=f"일괄 전처리 및 DB 저장 완료: {len(combined_df)}행 처리됨",
                summary=summary,
                data=combined_df.to_dict(orient="records")[:20]  # 처음 20행만 반환
            )
            
        except Exception as e:
            print(f"❌ 서비스: 일괄 처리 오류 - {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"일괄 전처리 실패: {str(e)}"
            ) 