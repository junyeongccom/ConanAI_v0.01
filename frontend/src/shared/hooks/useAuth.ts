import { useAuthStore, UserData } from '@/shared/store/authStore';
import { AuthService } from '@/domain/auth/services/authService';

// 인증 관련 커스텀 훅
export function useAuth() {
  const { isAuthenticated, isInitialized, user, token } = useAuthStore();

  return {
    // 상태
    isAuthenticated,
    isInitialized,
    user,
    token,
    
    // 편의 메서드
    login: (userData: UserData) => useAuthStore.getState().login(userData),
    logout: async () => await useAuthStore.getState().logout(),
    checkAuthStatus: async () => await useAuthStore.getState().checkAuthStatus(),
    
    // 사용자 정보 관련
    isLoggedIn: isAuthenticated && !!user,
    userEmail: user?.email,
    userName: user?.name || user?.username,
    userCompany: user?.company_name,
    userIndustry: user?.industry_type,
    
    // 권한 체크 (확장 가능)
    hasProfile: !!user,
    hasCompanyInfo: !!(user?.company_name && user?.industry_type),
  };
}

export default useAuth; 