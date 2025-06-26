import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// JWT 페이로드 인터페이스
export interface JWTPayload {
  sub: string;  // user_id
  email: string;
  username?: string;
  name?: string;
  company_name?: string;
  industry_type?: string;
  picture?: string;
  exp: number;
  iat: number;
}

// 사용자 데이터 인터페이스
export interface UserData {
  userId: string;
  email: string;
  username?: string;
  name?: string;
  company_name?: string;
  industry_type?: string;
  picture?: string;
}

// 인증 상태 인터페이스
interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean; // 인증 상태 초기화 완료 여부
  user: UserData | null;
  token: string | null;
  login: (userData: UserData) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: UserData) => void;
}

// JWT 토큰 디코딩 및 검증 유틸리티
const decodeAndValidateToken = (token: string): UserData | null => {
  try {
    const decoded: JWTPayload = jwtDecode(token);
    
    // 토큰 만료 확인
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('JWT 토큰이 만료되었습니다.');
      return null;
    }

    // 사용자 데이터 추출
    return {
      userId: decoded.sub,
      email: decoded.email,
      username: decoded.username,
      name: decoded.name || decoded.username,
      company_name: decoded.company_name,
      industry_type: decoded.industry_type,
      picture: decoded.picture,
    };
  } catch (error) {
    console.error('JWT 토큰 디코딩 실패:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      user: null,
      token: null,

      login: (userData: UserData) => {
        console.log('🔐 로그인 처리 시작');
        
        // 쿠키는 서버에서 HttpOnly로 설정되므로 클라이언트에서는 사용자 데이터만 관리
        set({
          isAuthenticated: true,
          isInitialized: true,
          user: userData,
          token: null, // HttpOnly 쿠키로 관리되므로 클라이언트에서는 접근 불가
        });

        console.log('✅ 로그인 성공:', userData.email);
      },

      logout: async () => {
        console.log('🚪 로그아웃 처리');
        
        try {
          // 백엔드 로그아웃 API 호출 (HttpOnly 쿠키 삭제 및 블랙리스트 등록)
          const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080'}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // 쿠키 포함
          });
          
          if (!response.ok) {
            console.warn('로그아웃 API 호출 실패, 로컬 상태만 정리합니다.');
          }
        } catch (error) {
          console.warn('로그아웃 API 호출 중 오류:', error);
        }

        // 상태 초기화 (쿠키는 서버에서 삭제됨)
        set({
          isAuthenticated: false,
          isInitialized: true, // 로그아웃 후에도 초기화는 완료된 상태
          user: null,
          token: null,
        });

        console.log('✅ 로그아웃 완료');
      },

      checkAuthStatus: async () => {
        // 인증 상태 확인을 조용히 수행 (에러 로그 없음)
        const setUnauthenticated = () => {
          set({
            isAuthenticated: false,
            isInitialized: true,
            user: null,
            token: null,
          });
        };

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 타임아웃
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080'}/auth/me`, {
            method: 'GET',
            credentials: 'include',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const userData = await response.json();
            set({
              isAuthenticated: true,
              isInitialized: true,
              user: userData,
              token: null,
            });
          } else {
            setUnauthenticated();
          }
        } catch (error) {
          // 모든 에러(네트워크, 타임아웃, 401 등)를 조용히 처리
          setUnauthenticated();
        }
      },

      setUser: (user: UserData) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 토큰은 별도로 관리하므로 사용자 정보와 인증 상태만 영속화
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // isInitialized는 페이지 로드 시마다 다시 체크해야 하므로 영속화하지 않음
      }),
    }
  )
); 