import sys
sys.path.append('.')

from app.foundation.initial_data_loader import load_all_data
from app.foundation.database import get_db

print("Starting data reload...")

# 데이터베이스 연결
db = next(get_db())

# 모든 데이터 로드
try:
    success = load_all_data(db)
    if success:
        print("Data reload completed successfully!")
    else:
        print("Data reload failed!")
except Exception as e:
    print(f"Error during data reload: {e}")

# s2-m14 requirements 확인
from app.domain.repository.disclosure_repository import DisclosureRepository

repo = DisclosureRepository(db)
requirements = repo.get_requirements_by_disclosure_id('s2-m14')
print(f'\nFound {len(requirements)} requirements for s2-m14:')
for req in requirements:
    print(f'- {req.requirement_id}: order={req.requirement_order}, text={req.requirement_text_ko[:50]}...') 