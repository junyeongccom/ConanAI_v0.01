from typing import Dict, List, Any, Optional
from fastapi import UploadFile, HTTPException
from app.domain.service.xsldsd_service import xsldsd_service
from app.platform.notification import send_slack_notification
import logging

# 로거 설정
logger = logging.getLogger(__name__)

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
        logger.info(f"Excel 파일 업로드 시작: {file.filename}")
        
        try:
            if not file.filename.endswith(('.xlsx', '.xls')):
                raise HTTPException(status_code=400, detail="Excel 파일만 업로드 가능합니다.")
            
            # Excel 파일 처리
            logger.info(f"Excel 파일 처리 중: {file.filename}")
            result = await self.service.save_uploaded_excel_file(file, sheet_names)
            logger.info(f"Excel 파일 처리 완료: {file.filename}")
            
            # 처리 완료 후 성공 알림 전송
            logger.info(f"Slack 알림 전송 시작: {file.filename}")
            await send_slack_notification(
                message="upload_success",
                filename=file.filename
            )
            logger.info(f"Slack 알림 전송 완료: {file.filename}")
            
            return result
            
        except HTTPException:
            # HTTPException은 그대로 재발생
            logger.error(f"HTTPException 발생: {file.filename}")
            raise
        except Exception as e:
            # 기타 예외 발생 시 실패 알림 전송
            logger.error(f"Excel 파일 처리 중 예외 발생: {file.filename}, 오류: {str(e)}")
            await send_slack_notification(
                message="upload_failure",
                filename=file.filename,
                error=str(e)
            )
            raise HTTPException(status_code=500, detail=f"Excel 파일 처리 중 오류가 발생했습니다: {str(e)}")


# 싱글톤 인스턴스
xsldsd_controller = XslDsdController()
