import yfinance as yf
from typing import List, Dict
from ..domain.model.stocktrend_schema import GameCompanyInfo
import logging
from datetime import datetime, timedelta

class GlobalGameFetcher:
    """해외 게임주 수집기"""
    
    TICKERS = ["EA", "TTWO", "NTES", "RBLX", "TCEHY", "UBSFY", "NTDOY", "NCBDY", "KNMCY", "SGAMY"]
    
    def format_market_cap(self, market_cap: float) -> str:
        """시가총액 포맷팅"""
        try:
            if market_cap >= 1e12:
                return f"${market_cap/1e12:.1f}T"
            else:
                return f"${market_cap/1e9:.1f}B"
        except (TypeError, ValueError):
            return "N/A"
    
    def get_stock_info(self, ticker: str) -> Dict:
        """개별 종목 정보 조회"""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            if not info:
                logging.error(f"🔴 [YFINANCE] No data - Ticker: {ticker}")
                return self.get_empty_stock_data(ticker)
            
            # 주가 변동률 계산
            end_date = datetime.now()
            start_date = end_date - timedelta(days=5)  # 충분한 여유를 두고 데이터 요청
            hist = stock.history(start=start_date, end=end_date)
            
            if len(hist) >= 2:
                prev_close = hist['Close'].iloc[-2]
                current = hist['Close'].iloc[-1]
                change_pct = ((current - prev_close) / prev_close) * 100
                change = f"{change_pct:+.1f}%"
            else:
                logging.warning(f"⚠️ [YFINANCE] No price history - Ticker: {ticker}")
                change = "N/A"
            
            return {
                "company": info.get('longName', ticker),
                "price": f"${info.get('currentPrice', 0):.2f}",
                "change": change,
                "marketCap": self.format_market_cap(info.get('marketCap', 0))
            }
            
        except Exception as e:
            logging.error(f"🔴 [YFINANCE] Error - Ticker: {ticker} - {str(e)}")
            return self.get_empty_stock_data(ticker)
    
    def get_empty_stock_data(self, ticker: str) -> Dict:
        """에러 시 기본 데이터 반환"""
        return {
            "company": ticker,
            "price": "N/A",
            "change": "N/A",
            "marketCap": "N/A"
        }
    
    async def get_global_game_stocks(self) -> List[GameCompanyInfo]:
        """해외 게임주 정보 수집 메인 함수"""
        companies = []
        
        for idx, ticker in enumerate(self.TICKERS):
            try:
                stock_data = self.get_stock_info(ticker)
                company_data = {
                    "rank": idx + 1,
                    "country": "해외",
                    **stock_data
                }
                companies.append(GameCompanyInfo(**company_data))
                logging.info(f"✅ [YFINANCE] Fetched {ticker} successfully")
                
            except Exception as e:
                logging.error(f"🔴 [YFINANCE] Failed to process - Ticker: {ticker} - {str(e)}")
                # 에러 발생해도 기본 데이터로 응답
                companies.append(GameCompanyInfo(
                    rank=idx + 1,
                    country="해외",
                    **self.get_empty_stock_data(ticker)
                ))
        
        if not companies:
            logging.warning("⚠️ [YFINANCE] No global stocks fetched")
        else:
            logging.info(f"✅ [YFINANCE] Successfully fetched {len(companies)} global stocks")
            
        return companies 