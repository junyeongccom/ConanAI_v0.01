import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

// Base URL 설정
const BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30초 타임아웃
  withCredentials: true, // 쿠키 자동 전송 활성화 (HttpOnly 쿠키 지원)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 요청 로깅만 처리 (쿠키는 브라우저가 자동 관리)
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('🍪 HttpOnly 쿠키가 브라우저에 의해 자동 전송됩니다.');
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ 요청 인터셉터 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 인증 오류 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    
    console.error(`❌ API 오류: ${response?.status} ${error.config?.url}`);
    
    // 인증 오류 처리 (401 Unauthorized, 403 Forbidden)
    if (response?.status === 401 || response?.status === 403) {
      console.warn('🔒 인증 오류 감지 - 로그아웃 처리');
      
      // 클라이언트 사이드에서만 실행
      if (typeof window !== 'undefined') {
        // 동적 import로 authStore 로드 (순환 참조 방지)
        const { useAuthStore } = await import('@/shared/store/authStore');
        
        // 로그아웃 처리
        useAuthStore.getState().logout();
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API 클라이언트 래퍼 함수들
export const api = {
  // GET 요청
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST 요청
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT 요청
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH 요청
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE 요청
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // 파일 업로드
  upload: async <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// 원본 axios 인스턴스도 내보내기 (고급 사용을 위해)
export { apiClient };

// 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// API 오류 처리 유틸리티
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // 서버가 응답했지만 오류 상태 코드
    const responseData = error.response.data as any;
    return {
      message: responseData?.message || error.message,
      status: error.response.status,
      code: responseData?.code,
      details: error.response.data,
    };
  } else if (error.request) {
    // 요청이 이루어졌지만 응답이 없음
    return {
      message: '서버에 연결할 수 없습니다.',
      status: 0,
    };
  } else {
    // 요청 설정 중 오류 발생
    return {
      message: error.message,
    };
  }
};

export default api; 