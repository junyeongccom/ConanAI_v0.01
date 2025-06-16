'use client';

import { useAuthStore } from '@/shared/store/authStore';
import { AuthService } from '@/domain/auth/services/authService';
import { useRouter } from 'next/navigation';

export default function AuthStatus() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          로그인
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* 사용자 프로필 */}
      <div className="flex items-center gap-2">
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name || user.username || 'User'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user.name || user.username}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
          {user.company_name && (
            <p className="text-xs text-gray-400">{user.company_name}</p>
          )}
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        로그아웃
      </button>
    </div>
  );
} 