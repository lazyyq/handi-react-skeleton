import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuthService } from '../contexts/ServicesContext';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '../../lib/queryKeys';

export const useLogin = () => {
  const { login: setAuthUser } = useAuthStore();
  const queryClient = useQueryClient();
  const authService = useAuthService();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
    onSuccess: (user) => {
      setAuthUser(user);
      // 로그인 성공 시 사용자 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 에러 처리 로직을 여기에 추가할 수 있습니다
      // 예: 토스트 메시지 표시, 에러 로깅 등
    },
    retry: false, // 로그인은 재시도하지 않음
  });
};

export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const authService = useAuthService();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      // 로그아웃 시 모든 캐시 클리어
      queryClient.clear();
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패 시에도 로컬 상태는 클리어
      clearAuth();
      queryClient.clear();
    },
    retry: false, // 로그아웃은 재시도하지 않음
  });
};

// 현재 사용자 정보 조회 (Repository를 통해)
export const useCurrentUser = () => {
  const authService = useAuthService();
  
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getCurrentUser(),
    enabled: false, // 필요할 때만 수동으로 실행
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 15 * 60 * 1000, // 15분
  });
}; 