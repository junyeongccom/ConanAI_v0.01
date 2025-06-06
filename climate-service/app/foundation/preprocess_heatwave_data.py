"""
기후 시나리오 기반 폭염일수 데이터 전처리 모듈

📌 목적:
기후 시나리오 기반 폭염일수 데이터를 전처리하여, 기준연도 및 미래 연도별 평균값과 
변화량(절대/%)을 산출하고, API나 DB 저장에서 사용할 수 있도록 반환하는 함수형 처리 모듈

📂 입력 파일:
- 위치: `app/platform/data/`
- 예: `고온 극한기후지수 - 경기도 (연별).csv`, `고온 극한기후지수 - 전라남도 (연별).csv` 등
"""

import pandas as pd
import os
from typing import Dict, List, Optional


def process_heatwave_csv(file_path: str) -> pd.DataFrame:
    """
    지정된 CSV 파일을 읽어와 전처리 및 평균값/변화량을 계산한 결과 DataFrame 반환
    
    Args:
        file_path (str): 처리할 CSV 파일의 경로
        
    Returns:
        pd.DataFrame: 전처리된 결과 DataFrame
        컬럼: ['시나리오', '지역명', '연도구간', '폭염일수', '변화량(일수)', '변화율(%)']
    
    Raises:
        FileNotFoundError: 파일이 존재하지 않을 때
        ValueError: 데이터 처리 중 오류가 발생할 때
    """
    try:
        # ✅ 1. F-DB-1: 데이터 수집 및 정제
        print(f"📖 CSV 파일 읽기 시작: {file_path}")
        
        # CSV 파일 읽기 (한글 인코딩 처리)
        df = pd.read_csv(file_path, encoding='utf-8-sig')
        
        # 지역명을 파일명에서 추출 (형식: "고온 극한기후지수 - 지역명 (연별).csv")
        file_name = os.path.basename(file_path)
        try:
            # "고온 극한기후지수 - " 이후부터 " (연별)" 이전까지 추출
            start_marker = "고온 극한기후지수 - "
            end_marker = " (연별)"
            
            start_idx = file_name.find(start_marker)
            end_idx = file_name.find(end_marker)
            
            if start_idx != -1 and end_idx != -1:
                지역명 = file_name[start_idx + len(start_marker):end_idx].strip()
            else:
                # 기존 방식으로 fallback
                지역명 = file_name.split()[3]
                
            print(f"📁 파일명: {file_name}")
            print(f"📍 추출된 지역명: {지역명}")
            
        except (IndexError, AttributeError) as e:
            print(f"❌ 지역명 추출 실패: {file_name}")
            raise ValueError(f"올바르지 않은 파일명 형식입니다. 예상 형식: '고온 극한기후지수 - 지역명 (연별).csv'")
        
        # 필요한 컬럼만 남기고 지역명 컬럼 추가
        df = df[["시나리오", "연도", "폭염일수"]].copy()
        df["지역명"] = 지역명
        
        # 연도 필터링: 2010~2065만 유지
        df = df[(df["연도"] >= 2010) & (df["연도"] <= 2065)].copy()
        print(f"📊 필터링 후 데이터 수: {len(df)}행")
        
        # ✅ 2. F-DB-2: 평균 폭염일수 계산
        print("🧮 평균 폭염일수 계산 시작")
        
        # 연도 구간별 그룹 정의
        def get_year_group(year: int) -> str:
            """연도를 구간으로 변환"""
            if 2010 <= year <= 2019:
                return "현재기후"
            elif 2026 <= year <= 2035:
                return "2030"
            elif 2036 <= year <= 2045:
                return "2040"
            elif 2046 <= year <= 2055:
                return "2050"
            else:
                return None
        
        # 연도구간 컬럼 추가
        df["연도구간"] = df["연도"].apply(get_year_group)
        
        # None 값 제거 (2020~2025, 2056~2065는 제외)
        df = df.dropna(subset=["연도구간"]).copy()
        
        # 시나리오, 지역명, 연도구간별 평균 폭염일수 계산
        avg_df = df.groupby(["시나리오", "지역명", "연도구간"])["폭염일수"].agg([
            lambda x: x.iloc[0] if len(x) == 1 else round(x.mean(), 2)
        ]).reset_index()
        
        # 컬럼명 정리
        avg_df.columns = ["시나리오", "지역명", "연도구간", "폭염일수"]
        
        print(f"✅ 평균 계산 완료. 그룹 수: {len(avg_df)}")
        
        # ✅ 3. F-DB-3: 변화량 분석
        print("📈 변화량 분석 시작")
        
        result_list = []
        
        # 지역별로 그룹화하여 변화량 계산
        for region, region_group in avg_df.groupby("지역명"):
            print(f"⚙️ 처리 중 지역: {region}")
            
            # 해당 지역의 현재기후 기준값 찾기 (모든 시나리오에서 공통)
            baseline_rows = region_group[region_group["연도구간"] == "현재기후"]
            
            if len(baseline_rows) == 0:
                print(f"⚠️ 기준연도(현재기후) 데이터 없음: {region}")
                continue
            
            # 현재기후 기준값 (첫 번째 시나리오의 현재기후 값 사용)
            baseline_heatwave = baseline_rows["폭염일수"].iloc[0]
            print(f"📊 {region} 현재기후 기준값: {baseline_heatwave}일")
            
            # 시나리오별로 처리
            for scenario in region_group["시나리오"].unique():
                scenario_group = region_group[region_group["시나리오"] == scenario]
                print(f"  ⚙️ 처리 중: {scenario} - {region}")
                
                # 각 연도구간별 변화량 계산
                for _, row in scenario_group.iterrows():
                    year_group = row["연도구간"]
                    current_heatwave = row["폭염일수"]
                    
                    # 변화량 계산
                    if year_group == "현재기후":
                        변화량_일수 = 0.0
                        변화율_percent = 0.0
                    else:
                        변화량_일수 = round(current_heatwave - baseline_heatwave, 2)
                        
                        # 변화율 계산 (기준연도가 0일 경우 처리)
                        if baseline_heatwave == 0:
                            변화율_percent = 0.0 if current_heatwave == 0 else None
                        else:
                            변화율_percent = round((변화량_일수 / baseline_heatwave) * 100, 2)
                    
                    # 결과 행 추가
                    result_list.append({
                        "시나리오": scenario,
                        "지역명": region,
                        "연도구간": year_group,
                        "폭염일수": current_heatwave,
                        "변화량(일수)": 변화량_일수,
                        "변화율(%)": 변화율_percent
                    })
        
        # ✅ 4. 출력 데이터 구조
        result_df = pd.DataFrame(result_list)
        
        # 연도구간 순서 정렬
        year_order = ["현재기후", "2030", "2040", "2050"]
        result_df["연도구간"] = pd.Categorical(result_df["연도구간"], categories=year_order, ordered=True)
        result_df = result_df.sort_values(["시나리오", "지역명", "연도구간"]).reset_index(drop=True)
        
        print(f"🎉 전처리 완료. 최종 결과: {len(result_df)}행")
        print(f"📋 컬럼: {list(result_df.columns)}")
        
        return result_df
        
    except FileNotFoundError:
        print(f"❌ 파일을 찾을 수 없습니다: {file_path}")
        raise
    except Exception as e:
        print(f"❌ 데이터 처리 중 오류 발생: {str(e)}")
        raise ValueError(f"데이터 처리 실패: {str(e)}")


def process_multiple_heatwave_files(data_dir: str) -> pd.DataFrame:
    """
    데이터 디렉토리의 모든 CSV 파일을 처리하여 통합 DataFrame 반환
    
    Args:
        data_dir (str): 데이터 파일들이 있는 디렉토리 경로
        
    Returns:
        pd.DataFrame: 모든 파일이 통합된 결과 DataFrame
    """
    try:
        all_results = []
        
        # 디렉토리의 CSV 파일 찾기
        csv_files = [f for f in os.listdir(data_dir) if f.endswith('.csv') and '고온 극한기후지수' in f]
        
        print(f"📂 처리할 파일 수: {len(csv_files)}")
        
        for file_name in csv_files:
            file_path = os.path.join(data_dir, file_name)
            print(f"⚙️ 처리 중: {file_name}")
            
            try:
                result_df = process_heatwave_csv(file_path)
                all_results.append(result_df)
                print(f"✅ 완료: {file_name} ({len(result_df)}행)")
            except Exception as e:
                print(f"❌ 파일 처리 실패 {file_name}: {str(e)}")
                continue
        
        if not all_results:
            raise ValueError("처리된 파일이 없습니다.")
        
        # 모든 결과 통합
        combined_df = pd.concat(all_results, ignore_index=True)
        print(f"🎉 전체 통합 완료: {len(combined_df)}행")
        
        return combined_df
        
    except Exception as e:
        print(f"❌ 다중 파일 처리 실패: {str(e)}")
        raise


def get_heatwave_summary(df: pd.DataFrame) -> Dict:
    """
    전처리된 폭염일수 데이터의 요약 통계 반환
    
    Args:
        df (pd.DataFrame): process_heatwave_csv 결과 DataFrame
        
    Returns:
        Dict: 요약 통계 정보
    """
    try:
        summary = {
            "총_레코드_수": len(df),
            "시나리오_수": df["시나리오"].nunique(),
            "지역_수": df["지역명"].nunique(),
            "연도구간_수": df["연도구간"].nunique(),
            "시나리오_목록": df["시나리오"].unique().tolist(),
            "지역_목록": df["지역명"].unique().tolist(),
            "폭염일수_통계": {
                "최소값": df["폭염일수"].min(),
                "최대값": df["폭염일수"].max(),
                "평균값": round(df["폭염일수"].mean(), 2),
                "중앙값": df["폭염일수"].median()
            },
            "변화량_통계": {
                "최소_변화량": df["변화량(일수)"].min(),
                "최대_변화량": df["변화량(일수)"].max(),
                "평균_변화량": round(df["변화량(일수)"].mean(), 2)
            }
        }
        
        return summary
        
    except Exception as e:
        print(f"❌ 요약 통계 생성 실패: {str(e)}")
        return {}
