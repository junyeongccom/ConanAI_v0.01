from typing import List
from ..domain.model.stocktrend_schema import GameCompanyInfo
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import asyncio
from concurrent.futures import ThreadPoolExecutor

class KGameCrawler:
    """국내 게임주 크롤러 - Selenium 기반"""
    
    NAVER_GAME_URL = "https://finance.naver.com/sise/sise_group_detail.naver?type=upjong&no=263"
    WAIT_TIMEOUT = 10  # 요소 대기 시간 (초)
    
    def setup_driver(self) -> webdriver.Chrome:
        """Headless Chrome 드라이버 설정"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920x1080')
        chrome_options.add_argument('--lang=ko_KR')
        
        return webdriver.Chrome(options=chrome_options)
    
    def parse_stock_data(self, driver: webdriver.Chrome) -> List[dict]:
        """주식 데이터 파싱"""
        companies = []
        
        try:
            # 테이블이 로드될 때까지 대기
            table = WebDriverWait(driver, self.WAIT_TIMEOUT).until(
                EC.presence_of_element_located((By.CLASS_NAME, "type_5"))
            )
            
            # 모든 종목 행 추출
            rows = table.find_elements(By.TAG_NAME, "tr")
            
            for idx, row in enumerate(rows[2:], 1):  # 헤더 제외
                try:
                    cols = row.find_elements(By.TAG_NAME, "td")
                    if len(cols) < 10:  # 빈 행 제외
                        continue
                    
                    # 종목명 (첫번째 td의 a 태그)
                    name_element = cols[0].find_element(By.TAG_NAME, "a")
                    if not name_element:
                        continue
                        
                    company_name = name_element.text.strip()
                    current_price = cols[1].text.strip()
                    price_change = cols[2].text.strip()
                    change_percent = cols[3].text.strip()
                    trading_value = cols[6].text.strip()
                    
                    company_data = {
                        "rank": idx,
                        "country": "한국",
                        "company": company_name,
                        "price": current_price or "N/A",
                        "change": f"{price_change} ({change_percent})" if price_change and change_percent else "0.0%",
                        "marketCap": (trading_value + "억원") if trading_value else "N/A"
                    }
                    
                    companies.append(company_data)
                    logging.info(f"✅ [NAVER] Parsed company: {company_name}")
                    
                except (NoSuchElementException, IndexError) as e:
                    logging.warning(f"⚠️ [NAVER] Failed to parse row {idx} - {str(e)}")
                    continue
                    
        except TimeoutException:
            logging.error("🔴 [NAVER] Timeout waiting for stock table to load")
        except Exception as e:
            logging.error(f"🔴 [NAVER] Failed to parse stock data - {str(e)}")
            
        return companies
    
    def crawl_stocks(self) -> List[dict]:
        """동기적으로 주식 데이터 크롤링"""
        driver = None
        try:
            driver = self.setup_driver()
            driver.get(self.NAVER_GAME_URL)
            return self.parse_stock_data(driver)
            
        except Exception as e:
            logging.error(f"🔴 [NAVER] Crawling failed - {str(e)}")
            return []
            
        finally:
            if driver:
                driver.quit()
    
    async def get_korean_game_stocks(self) -> List[GameCompanyInfo]:
        """비동기로 주식 데이터 수집"""
        try:
            # ThreadPoolExecutor를 통해 동기 크롤링 함수를 비동기적으로 실행
            loop = asyncio.get_event_loop()
            with ThreadPoolExecutor() as pool:
                companies = await loop.run_in_executor(pool, self.crawl_stocks)
            
            if not companies:
                logging.warning("⚠️ [NAVER] No Korean game stocks found")
                return []
            
            logging.info(f"✅ [NAVER] Successfully fetched {len(companies)} Korean stocks")
            return [GameCompanyInfo(**company) for company in companies]
            
        except Exception as e:
            logging.error(f"🔴 [NAVER] Failed to fetch Korean stocks - {str(e)}")
            return []
