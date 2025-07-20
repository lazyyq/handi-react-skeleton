// Infrastructure Layer - 외부 API 응답/요청 스키마
export interface PostDto {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostDto {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostDto {
  title?: string;
  body?: string;
  userId?: number;
}

// API 응답에서만 사용되는 추가 필드가 있을 수 있음
export interface PostListResponseDto {
  posts: PostDto[];
  total: number;
  page?: number;
  limit?: number;
}

// JSONPlaceholder API는 단순하지만, 실제 API에서는 더 복잡할 수 있음
export interface ApiErrorDto {
  message: string;
  code: string;
  details?: any;
} 