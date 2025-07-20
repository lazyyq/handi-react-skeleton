import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePostService } from '../contexts/ServicesContext';
import { queryKeys } from '../../lib/queryKeys';
import type { Post } from '../../domain/entities/Post';

export const usePosts = () => {
  const postService = usePostService();
  
  return useQuery({
    queryKey: queryKeys.posts.list(),
    queryFn: () => postService.getPosts(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const usePost = (id: number) => {
  const postService = usePostService();
  
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postService.getPost(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 추가된 Mutation hooks
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const postService = usePostService();

  return useMutation({
    mutationFn: (post: Omit<Post, 'id'>) => postService.createPost(post),
    onSuccess: () => {
      // 게시글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    onError: (error) => {
      console.error('게시글 생성 실패:', error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const postService = usePostService();

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) =>
      postService.updatePost(id, post),
    onSuccess: (updatedPost: Post) => {
      // 해당 게시글 상세 쿼리 업데이트
      queryClient.setQueryData(
        queryKeys.posts.detail(updatedPost.id),
        updatedPost
      );
      // 게시글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    onError: (error) => {
      console.error('게시글 수정 실패:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const postService = usePostService();

  return useMutation({
    mutationFn: (id: number) => postService.deletePost(id),
    onSuccess: (_, deletedId) => {
      // 해당 게시글 상세 쿼리 제거
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(deletedId) });
      // 게시글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    onError: (error) => {
      console.error('게시글 삭제 실패:', error);
    },
  });
}; 