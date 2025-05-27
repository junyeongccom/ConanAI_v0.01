import os
import tempfile
from pathlib import Path
from typing import Tuple, Optional
from fastapi import UploadFile, HTTPException

class FileUtils:
    """파일 처리 유틸리티 클래스"""
    
    @staticmethod
    def validate_pdf_file(file: UploadFile) -> None:
        """
        PDF 파일 유효성을 검사합니다.
        
        Args:
            file (UploadFile): 업로드된 파일
            
        Raises:
            HTTPException: 파일이 유효하지 않은 경우
        """
        # 파일 선택 여부 확인
        if not file.filename:
            raise HTTPException(status_code=400, detail="파일이 선택되지 않았습니다.")
        
        # PDF 파일 확장자 확인
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다.")
    
    @staticmethod
    async def validate_file_size(file: UploadFile, max_size_mb: int = 10) -> bytes:
        """
        파일 크기를 검사하고 파일 내용을 반환합니다.
        
        Args:
            file (UploadFile): 업로드된 파일
            max_size_mb (int): 최대 파일 크기 (MB)
            
        Returns:
            bytes: 파일 내용
            
        Raises:
            HTTPException: 파일 크기가 제한을 초과하는 경우
        """
        max_file_size = max_size_mb * 1024 * 1024  # MB to bytes
        file_content = await file.read()
        
        if len(file_content) > max_file_size:
            raise HTTPException(
                status_code=400, 
                detail=f"파일 크기는 {max_size_mb}MB를 초과할 수 없습니다."
            )
        
        return file_content
    
    @staticmethod
    def save_temp_file(file_content: bytes, suffix: str = '.pdf') -> str:
        """
        임시 파일을 생성하고 내용을 저장합니다.
        
        Args:
            file_content (bytes): 파일 내용
            suffix (str): 파일 확장자
            
        Returns:
            str: 임시 파일 경로
        """
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(file_content)
            return temp_file.name
    
    @staticmethod
    def cleanup_temp_file(file_path: str) -> None:
        """
        임시 파일을 삭제합니다.
        
        Args:
            file_path (str): 삭제할 파일 경로
        """
        if file_path and os.path.exists(file_path):
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"임시 파일 삭제 중 오류 발생: {e}")

# 편의 함수들
async def process_uploaded_pdf(file: UploadFile) -> Tuple[str, str]:
    """
    업로드된 PDF 파일을 처리하고 임시 파일 경로를 반환합니다.
    
    Args:
        file (UploadFile): 업로드된 PDF 파일
        
    Returns:
        Tuple[str, str]: (임시 파일 경로, 원본 파일명)
        
    Raises:
        HTTPException: 파일 처리 중 오류가 발생한 경우
    """
    # 파일 유효성 검사
    FileUtils.validate_pdf_file(file)
    
    # 파일 크기 검사 및 내용 읽기
    file_content = await FileUtils.validate_file_size(file, max_size_mb=10)
    
    # 임시 파일 저장
    temp_file_path = FileUtils.save_temp_file(file_content, suffix='.pdf')
    
    return temp_file_path, file.filename or "unknown.pdf"

def cleanup_file(file_path: Optional[str]) -> None:
    """
    파일을 안전하게 정리합니다.
    
    Args:
        file_path (Optional[str]): 정리할 파일 경로
    """
    if file_path:
        FileUtils.cleanup_temp_file(file_path) 