import { apiClient } from '@/shared/services/apiClient';
import { StructuredIndicators, RequirementData, IndicatorItemData } from '../types';

// 확장된 인디케이터 타입 (section, category 포함)
interface ExtendedIndicatorItemData extends IndicatorItemData {
  section: string;
  category: string;
}

// 목업 데이터 (개발용)
const mockData: StructuredIndicators = {
  "지배구조": {
    "기후 관련 위험과 기회에 대한 이사회의 감독 사항": [
      {
        disclosure_id: "s2-g1",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험 및 기회를 감독할 책임이 있는 이사회 구성원 또는 이사회 위원회(들)를 공시하여야 한다."
      },
      {
        disclosure_id: "s2-g2",
        topic: "기후 관련 위험과 기회에 대한 이사회의 감독 사항",
        disclosure_ko: "기후 관련 위험 및 기회에 대한 책임이 해당 의사결정기구(들)에게 어떻게 반영되는지에 대한 설명"
      }
    ],
    "기후 관련 위험과 기회에 대한 경영진의 역할": [
      {
        disclosure_id: "s2-g3",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험 및 기회를 모니터링, 관리 및 감독하는 데 있어서 경영진의 역할을 공시하여야 한다."
      }
    ]
  },
  "전략": {
    "위험 및 기회": [
      {
        disclosure_id: "s2-s1",
        topic: "목적",
        disclosure_ko: "기업은 일반목적재무보고서의 이용자가 기업 전망에 영향을 미칠 수 있는 기후 관련 위험 및 기회를 이해할 수 있도록 정보를 공시하여야 한다."
      },
      {
        disclosure_id: "s2-s2",
        topic: "위험 및 기회",
        disclosure_ko: "기업이 단기, 중기 및 장기에 걸쳐 노출된 기후 관련 위험 및 기회에 대한 설명"
      }
    ],
    "전략 및 의사결정": [
      {
        disclosure_id: "s2-s3",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험 및 기회에 대응하기 위한 전략을 공시하여야 한다."
      }
    ]
  },
  "위험관리": {
    "위험관리 프로세스": [
      {
        disclosure_id: "s2-r1",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험을 식별, 평가, 우선순위 설정 및 모니터링하는 프로세스를 공시하여야 한다."
      }
    ]
  },
  "지표와 목표": {
    "기후 관련 지표": [
      {
        disclosure_id: "s2-m1",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험 및 기회와 관련된 성과를 측정하고 모니터링하는 데 사용하는 지표를 공시하여야 한다."
      }
    ],
    "기후 관련 목표": [
      {
        disclosure_id: "s2-m2",
        topic: "목적",
        disclosure_ko: "기업은 기후 관련 위험을 완화하거나 기후 관련 기회에 적응하기 위해 설정한 정량적 및 정성적 목표를 공시하여야 한다."
      }
    ]
  }
};

export const getStructuredIndicators = async (): Promise<StructuredIndicators> => {
  try {
    const response = await apiClient.get<StructuredIndicators>('/api/disclosure/disclosure-data/disclosures');
    console.log('✅ 백엔드 서버에서 데이터를 성공적으로 가져왔습니다.');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch structured indicators:', error);
    console.log('🔄 백엔드 서버 연결 실패 - 목업 데이터를 사용합니다.');
    
    // 백엔드 서버가 실행되지 않을 때 목업 데이터 반환
    return mockData;
  }
};

// 개별 공시 지표 조회 (향후 사용을 위해)
export const getIndicatorById = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/disclosure/disclosure-data/disclosures/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch indicator with id ${id}:`, error);
    
    // 목업 데이터에서 해당 ID 찾기
    for (const section of Object.values(mockData)) {
      for (const categoryItems of Object.values(section)) {
        const item = categoryItems.find(item => item.disclosure_id === id);
        if (item) return item;
      }
    }
    
    throw error;
  }
};

// 필터링된 공시 지표 목록 조회 (향후 사용을 위해)
export const getFilteredIndicators = async (section?: string, category?: string) => {
  try {
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (category) params.append('category', category);
    
    const response = await apiClient.get(`/api/disclosure/disclosure-data/disclosures/list?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch filtered indicators:', error);
    
    // 목업 데이터에서 필터링
    let filteredData = mockData;
    
    if (section) {
      filteredData = { [section]: mockData[section] || {} };
    }
    
    if (category && section) {
      const sectionData = filteredData[section];
      if (sectionData && sectionData[category]) {
        filteredData = { [section]: { [category]: sectionData[category] } };
      }
    }
    
    // 플랫한 배열로 변환 (기존 API 형식에 맞춤)
    const flatArray: ExtendedIndicatorItemData[] = [];
    for (const [sectionName, categories] of Object.entries(filteredData)) {
      for (const [categoryName, items] of Object.entries(categories)) {
        for (const item of items) {
          flatArray.push({
            ...item,
            section: sectionName,
            category: categoryName
          });
        }
      }
    }
    
    return flatArray;
  }
};

/**
 * 특정 공시 지표(disclosure)에 대한 요구사항 목록을 서버에서 가져옵니다.
 * @param disclosureId 요구사항을 조회할 공시 지표의 ID
 * @returns 요구사항 데이터 배열, 실패 시 빈 배열을 반환합니다.
 */
export const getRequirements = async (disclosureId: string): Promise<RequirementData[]> => {
  try {
    const response = await apiClient.get<RequirementData[]>(`/api/disclosure/disclosure-data/disclosures/${disclosureId}/requirements`);
    return response.data;
  } catch (error) {
    // 실제 운영 환경에서는 에러 로깅 서비스(Sentry 등)를 연동하는 것이 좋습니다.
    console.error(`Failed to fetch requirements for disclosure ${disclosureId}:`, error);
    // 에러가 발생했음을 호출한 쪽에서 알 수 있도록 에러를 다시 throw 합니다.
    throw new Error('요구사항 데이터를 불러오는 데 실패했습니다.');
  }
}; 