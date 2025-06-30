from app.domain.service.report_service import ReportService

class ReportController:
    def __init__(self, report_service: ReportService):
        self.report_service = report_service
        
    async def create_report(self, user_id: str):
        return await self.report_service.generate_report(user_id) 