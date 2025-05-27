from fastapi import UploadFile
from typing import Optional, List
from datetime import datetime
from ...platform.kgame_crawler import KGameCrawler
from ...platform.globalgame_fetcher import GlobalGameFetcher
from ..service.game_announcement_service import GameAnnouncementService
from ..model.stocktrend_schema import GameCompanyInfo, GameCompanyResponse

class StocktrendController:
    """게임주 트렌드 컨트롤러"""
    
    def __init__(self):
        self.k_crawler = KGameCrawler()
        self.global_fetcher = GlobalGameFetcher()
        self.announcement_service = GameAnnouncementService()
    
    async def get_game_stocks(self) -> GameCompanyResponse:
        """국내외 게임주 정보 통합 조회"""
        # 국내외 주가 정보 수집
        korean_stocks = await self.k_crawler.get_korean_game_stocks()
        global_stocks = await self.global_fetcher.get_global_game_stocks()
        
        # 모든 기업 정보 통합
        all_stocks = korean_stocks + global_stocks
        
        # 공시내용 추가
        for stock in all_stocks:
            stock.announcement = self.announcement_service.get_announcement(stock.company)
        
        # 응답 생성
        response = GameCompanyResponse(
            companies=all_stocks,
            total_count=len(all_stocks),
            timestamp=datetime.now().isoformat()
        )
        
        return response