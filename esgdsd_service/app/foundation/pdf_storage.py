import os
import aiofiles
from fastapi import UploadFile
from typing import Optional

async def save_temp_pdf_file(upload_file: UploadFile) -> str:
    """
    업로드된 PDF 파일을 임시 디렉토리에 저장합니다.

    Args:
        upload_file (UploadFile): 업로드된 PDF 파일

    Returns:
        str: 저장된 파일의 경로

    Raises:
        IOError: 파일 저장 중 오류가 발생한 경우
    """
    temp_file_path = f"temp_{upload_file.filename}"
    
    try:
        async with aiofiles.open(temp_file_path, 'wb') as out_file:
            content = await upload_file.read()
            await out_file.write(content)
        return temp_file_path
    except Exception as e:
        raise IOError(f"Failed to save PDF file: {str(e)}")

def delete_temp_file(path: str) -> None:
    """
    임시 파일을 삭제합니다.

    Args:
        path (str): 삭제할 파일의 경로

    Raises:
        IOError: 파일 삭제 중 오류가 발생한 경우
    """
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        raise IOError(f"Failed to delete temporary file: {str(e)}") 