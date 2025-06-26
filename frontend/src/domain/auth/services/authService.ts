import { jwtDecode } from 'jwt-decode';
import { useAuthStore, UserData, JWTPayload } from '@/shared/store/authStore';

export class AuthService {
  /**
   * URL 쿼리 파라미터에서 JWT 토큰을 추출합니다.
   */
  static extractTokenFromCallback(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      return token;
    } catch (error) {
      console.error('URL 파싱 오류:', error);
      return null;
    }
  }

  /**
   * JWT 토큰을 디코딩하여 사용자 정보를 추출합니다.
   */
  static decodeJWT(token: string): UserData | null {
    try {
      const decoded: JWTPayload = jwtDecode(token);
      
      // 토큰 만료 확인
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.error('토큰이 만료되었습니다.');
        return null;
      }

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
      console.error('JWT 디코딩 오류:', error);
      return null;
    }
  }

  /**
   * Google OAuth 콜백을 처리합니다.
   */
  static async handleCallback(callbackUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      // HttpOnly 쿠키가 이미 설정되었으므로 백엔드에서 사용자 정보 가져오기
      const response = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080'}/auth/me`, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      });

      if (response.ok) {
        const userData = await response.json();
        
        // 스토어에 사용자 데이터 저장
        useAuthStore.getState().login(userData);
        
        return { success: true };
      } else {
        return { success: false, error: '사용자 정보를 가져올 수 없습니다.' };
      }
    } catch (error) {
      console.error('콜백 처리 오류:', error);
      return { success: false, error: '인증 처리 중 오류가 발생했습니다.' };
    }
  }

  /**
   * Google OAuth 로그인을 시작합니다.
   */
  static initiateGoogleLogin(): void {
    const loginUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080'}/auth/google/login`;
    window.location.href = loginUrl;
  }

  /**
   * 로그아웃을 처리합니다.
   */
  static async logout(): Promise<void> {
    await useAuthStore.getState().logout();
  }

  /**
   * 현재 인증 상태를 확인합니다.
   */
  static isAuthenticated(): boolean {
    return useAuthStore.getState().isAuthenticated;
  }

  /**
   * 현재 사용자 정보를 반환합니다.
   */
  static getCurrentUser(): UserData | null {
    return useAuthStore.getState().user;
  }

  /**
   * 애플리케이션 초기화 시 인증 상태를 복구합니다.
   */
  static async initializeAuth(): Promise<void> {
    await useAuthStore.getState().checkAuthStatus();
  }
} 