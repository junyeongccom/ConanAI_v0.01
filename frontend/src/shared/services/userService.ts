import { api, ApiResponse, handleApiError } from './apiClient';
import { UserData } from '@/shared/store/authStore';

// 사용자 관련 API 서비스
export class UserService {
  /**
   * 현재 사용자 프로필 조회
   */
  static async getProfile(): Promise<UserData> {
    try {
      const response = await api.get<ApiResponse<UserData>>('/api/user/profile');
      return response.data;
    } catch (error: any) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateProfile(userData: Partial<UserData>): Promise<UserData> {
    try {
      const response = await api.put<ApiResponse<UserData>>('/api/user/profile', userData);
      return response.data;
    } catch (error: any) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * 사용자 회사 정보 업데이트
   */
  static async updateCompanyInfo(companyData: {
    company_name?: string;
    industry_type?: string;
  }): Promise<UserData> {
    try {
      const response = await api.patch<ApiResponse<UserData>>('/api/user/company', companyData);
      return response.data;
    } catch (error: any) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * 사용자 계정 삭제
   */
  static async deleteAccount(): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>('/api/user/account');
    } catch (error: any) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
}

export default UserService; 