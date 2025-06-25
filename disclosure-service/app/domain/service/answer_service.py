# Answer 도메인 Service
import logging
import json
from typing import Dict, Any, List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session

from app.domain.repository.answer_repository import AnswerRepository
from app.domain.repository.disclosure_repository import DisclosureRepository
from app.domain.model.answer_schema import (
    AnswerBatchUpdatePayload, 
    AnswerBatchResponse,
    AnswerResponse
)

logger = logging.getLogger("disclosure-service")

class AnswerService:
    """Answer 도메인 비즈니스 로직 처리 계층"""
    
    def __init__(self, db: Session, answer_repository: AnswerRepository, disclosure_repository: DisclosureRepository):
        self.db = db
        self.answer_repository = answer_repository
        self.disclosure_repository = disclosure_repository
    
    def _map_answer_data_to_columns(self, answer_data: Any, data_required_type: str) -> Dict[str, Any]:
        """
        답변 데이터를 data_required_type에 따라 적절한 컬럼에 매핑합니다.
        
        Args:
            answer_data: 사용자가 입력한 답변 데이터
            data_required_type: 요구사항의 데이터 타입
            
        Returns:
            Dict[str, Any]: 데이터베이스 컬럼에 매핑된 데이터
        """
        column_data = {
            "answer_value_text": None,
            "answer_value_number": None,
            "answer_value_boolean": None,
            "answer_value_date": None,
            "answer_value_json": None,
            "last_edited_at": datetime.utcnow()
        }
        
        try:
            if data_required_type in ["text", "textarea", "select"]:
                column_data["answer_value_text"] = str(answer_data) if answer_data is not None else None
                
            elif data_required_type in ["number", "integer", "float"]:
                if answer_data is not None:
                    column_data["answer_value_number"] = float(answer_data)
                    
            elif data_required_type == "boolean":
                if answer_data is not None:
                    if isinstance(answer_data, bool):
                        column_data["answer_value_boolean"] = answer_data
                    elif isinstance(answer_data, str):
                        column_data["answer_value_boolean"] = answer_data.lower() in ["true", "yes", "1"]
                    else:
                        column_data["answer_value_boolean"] = bool(answer_data)
                        
            elif data_required_type == "date":
                if answer_data is not None:
                    if isinstance(answer_data, str):
                        column_data["answer_value_date"] = datetime.fromisoformat(answer_data)
                    elif isinstance(answer_data, datetime):
                        column_data["answer_value_date"] = answer_data
                        
            elif data_required_type in [
                "multiselect", "checkbox", "structured_list", "table_input", 
                "json", "object", "array"
            ]:
                if answer_data is not None:
                    # 이미 dict/list인 경우 그대로, 문자열인 경우 JSON 파싱 시도
                    if isinstance(answer_data, (dict, list)):
                        column_data["answer_value_json"] = answer_data
                    else:
                        try:
                            column_data["answer_value_json"] = json.loads(str(answer_data))
                        except json.JSONDecodeError:
                            # JSON 파싱 실패 시 텍스트로 저장
                            column_data["answer_value_text"] = str(answer_data)
                            
            else:
                # 알 수 없는 타입은 JSON으로 저장 시도, 실패 시 텍스트로 저장
                if answer_data is not None:
                    if isinstance(answer_data, (dict, list)):
                        column_data["answer_value_json"] = answer_data
                    else:
                        column_data["answer_value_text"] = str(answer_data)
                        
        except Exception as e:
            logger.warning(f"데이터 매핑 중 오류 발생, 텍스트로 저장: {str(e)}")
            if answer_data is not None:
                column_data["answer_value_text"] = str(answer_data)
        
        return column_data
    
    def upsert_answers_batch(
        self, 
        user_id: UUID, 
        payload: AnswerBatchUpdatePayload
    ) -> AnswerBatchResponse:
        """
        여러 답변을 배치로 UPSERT 처리합니다.
        
        Args:
            user_id: 사용자 UUID
            payload: 배치 답변 업데이트 요청 데이터
            
        Returns:
            AnswerBatchResponse: 처리 결과
        """
        processed_count = 0
        created_count = 0
        updated_count = 0
        failed_count = 0
        failed_requirements = []
        
        logger.info(f"답변 배치 처리 시작: user_id={user_id}, 답변 수={len(payload.answers)}")
        
        try:
            for answer_payload in payload.answers:
                try:
                    requirement_id = answer_payload.requirement_id
                    answer_data = answer_payload.answer_data
                    
                    # 요구사항의 데이터 타입 조회 (DisclosureRepository 사용)
                    requirement = self.disclosure_repository.get_requirement_by_id(requirement_id)
                    if not requirement:
                        logger.error(f"요구사항을 찾을 수 없음: {requirement_id}")
                        failed_count += 1
                        failed_requirements.append(requirement_id)
                        continue
                    
                    data_required_type = requirement.data_required_type
                    logger.debug(f"요구사항 {requirement_id}의 데이터 타입: {data_required_type}")
                    
                    # 기존 답변 존재 여부 확인 (생성/수정 카운트를 위해)
                    existing_answer = self.answer_repository.get_answer_by_user_and_requirement(
                        user_id, requirement_id
                    )
                    is_update = existing_answer is not None
                    
                    # 답변 데이터를 적절한 컬럼에 매핑
                    column_data = self._map_answer_data_to_columns(answer_data, data_required_type)
                    
                    # UPSERT 수행
                    answer = self.answer_repository.upsert_answer(
                        user_id=user_id,
                        requirement_id=requirement_id,
                        data_to_update=column_data
                    )
                    
                    if answer:
                        processed_count += 1
                        if is_update:
                            updated_count += 1
                        else:
                            created_count += 1
                        logger.debug(f"답변 처리 성공: {requirement_id} ({'업데이트' if is_update else '생성'})")
                    else:
                        failed_count += 1
                        failed_requirements.append(requirement_id)
                        logger.error(f"답변 처리 실패: {requirement_id}")
                        
                except Exception as e:
                    failed_count += 1
                    failed_requirements.append(answer_payload.requirement_id)
                    logger.error(f"답변 처리 중 예외 발생: {answer_payload.requirement_id}, error={str(e)}")
            
            # 트랜잭션 커밋
            self.db.commit()
            logger.info(f"답변 배치 처리 완료 및 커밋: user_id={user_id}, 성공={processed_count}, 실패={failed_count}")
            
        except Exception as e:
            # 트랜잭션 롤백
            self.db.rollback()
            logger.error(f"답변 배치 처리 중 심각한 오류 발생, 롤백: user_id={user_id}, error={str(e)}")
            # 전체 실패로 처리
            failed_count = len(payload.answers)
            failed_requirements = [answer.requirement_id for answer in payload.answers]
            processed_count = 0
            created_count = 0
            updated_count = 0
        
        success = failed_count == 0
        message = f"답변 배치 처리가 완료되었습니다. (성공: {processed_count}, 실패: {failed_count})"
        
        return AnswerBatchResponse(
            success=success,
            message=message,
            processed_count=processed_count,
            created_count=created_count,
            updated_count=updated_count,
            failed_count=failed_count,
            failed_requirements=failed_requirements
        )
    
    def get_answers_by_user_id(self, user_id: UUID) -> List[AnswerResponse]:
        """
        사용자의 모든 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            
        Returns:
            List[AnswerResponse]: 사용자 답변 목록
        """
        try:
            # Repository에서 ORM 객체들을 받아옴
            answers = self.answer_repository.get_answers_by_user_id(user_id)
            
            # ORM 객체를 DTO로 변환하여 반환
            return [AnswerResponse.from_attributes(answer) for answer in answers]
            
        except Exception as e:
            logger.error(f"사용자 답변 목록 조회 실패: user_id={user_id}, error={str(e)}")
            return []
    
    def get_answer_by_requirement(
        self, 
        user_id: UUID, 
        requirement_id: str
    ) -> Optional[AnswerResponse]:
        """
        특정 요구사항에 대한 사용자 답변을 조회합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            AnswerResponse 또는 None
        """
        try:
            # Repository에서 ORM 객체를 받아옴
            answer = self.answer_repository.get_answer_by_user_and_requirement(user_id, requirement_id)
            
            # ORM 객체를 DTO로 변환하여 반환
            if answer:
                return AnswerResponse.from_attributes(answer)
            return None
            
        except Exception as e:
            logger.error(f"답변 조회 실패: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            return None
    
    def delete_answer(self, user_id: UUID, requirement_id: str) -> bool:
        """
        특정 답변을 삭제합니다.
        
        Args:
            user_id: 사용자 UUID
            requirement_id: 요구사항 ID
            
        Returns:
            bool: 삭제 성공 여부
        """
        try:
            result = self.answer_repository.delete_answer(user_id, requirement_id)
            if result:
                self.db.commit()
                logger.info(f"답변 삭제 완료 및 커밋: user_id={user_id}, requirement_id={requirement_id}")
            return result
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"답변 삭제 실패 및 롤백: user_id={user_id}, requirement_id={requirement_id}, error={str(e)}")
            return False 