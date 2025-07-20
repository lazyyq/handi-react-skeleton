import { QueryClient } from '@tanstack/react-query';

// React Query 관련 유틸리티 함수들
export const invalidatePostsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ 
    queryKey: ['posts'], 
    exact: false 
  });
};

export const invalidatePostQuery = (queryClient: QueryClient, postId: number) => {
  queryClient.invalidateQueries({ 
    queryKey: ['posts', 'detail', postId] 
  });
};

// 타입 헬퍼
export type QueryClientType = QueryClient; 