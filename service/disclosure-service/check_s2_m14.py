import sys
sys.path.append('.')

from app.foundation.database import get_db
from app.domain.repository.disclosure_repository import DisclosureRepository

# 데이터베이스 연결
db = next(get_db())
repo = DisclosureRepository(db)

# s2-m14의 requirements 조회
requirements = repo.get_requirements_by_disclosure_id('s2-m14')
print(f'Found {len(requirements)} requirements for s2-m14:')
for req in requirements:
    print(f'- {req.requirement_id}: order={req.requirement_order}, text={req.requirement_text_ko[:50]}...')

# 각 requirement 상세 정보
print('\n=== Detailed Information ===')
for req in requirements:
    print(f'\nRequirement ID: {req.requirement_id}')
    print(f'Order: {req.requirement_order}')
    print(f'Type: {req.data_required_type}')
    print(f'Text: {req.requirement_text_ko}')
    print(f'Schema: {req.input_schema}')
    print('-' * 50) 