import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

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
  login: (token: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
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

      login: (token: string) => {
        console.log('🔐 로그인 처리 시작');
        
        // JWT 디코딩 및 검증
        const userData = decodeAndValidateToken(token);
        
        if (!userData) {
          console.error('❌ 유효하지 않은 토큰');
          return;
        }

        // 토큰을 localStorage와 쿠키에 저장
        localStorage.setItem('access_token', token);
        Cookies.set('auth_token', token, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        });

        // 상태 업데이트
        set({
          isAuthenticated: true,
          isInitialized: true,
          user: userData,
          token,
        });

        console.log('✅ 로그인 성공:', userData.email);
      },

      logout: () => {
        console.log('🚪 로그아웃 처리');
        
        // 토큰 제거
        localStorage.removeItem('access_token');
        Cookies.remove('auth_token');

        // 상태 초기화
        set({
          isAuthenticated: false,
          isInitialized: true, // 로그아웃 후에도 초기화는 완료된 상태
          user: null,
          token: null,
        });

        console.log('✅ 로그아웃 완료');
      },

      checkAuthStatus: () => {
        console.log('🔍 인증 상태 확인 시작');
        
        // localStorage에서 토큰 확인
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          console.log('📭 저장된 토큰이 없습니다.');
          // 토큰이 없어도 초기화는 완료된 상태로 설정
          set({ isInitialized: true });
          return;
        }

        // 토큰 디코딩 및 검증
        const userData = decodeAndValidateToken(token);
        
        if (!userData) {
          console.log('🔄 토큰이 유효하지 않아 로그아웃 처리');
          get().logout();
          return;
        }

        // 상태 복구
        set({
          isAuthenticated: true,
          isInitialized: true,
          user: userData,
          token,
        });

        console.log('✅ 인증 상태 복구 완료:', userData.email);
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