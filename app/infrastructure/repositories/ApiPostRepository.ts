import type { Post } from '../../domain/entities/Post';
import type { PostRepository } from '../../domain/repositories/PostRepository';
import type { PostDto } from '../dto/PostDto';
import { PostMapper } from '../mappers/PostMapper';
import { apiClient } from '../../lib/apiClient';

// Infrastructure Layer - 외부 의존성(API) 구체적 구현
export class ApiPostRepository implements PostRepository {
  async findAll(): Promise<Post[]> {
    const response = await apiClient.get<PostDto[]>('/posts');
    // DTO → Domain Entity 변환
    return PostMapper.toDomainList(response.data);
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const response = await apiClient.get<PostDto>(`/posts/${id}`);
      // DTO → Domain Entity 변환
      return PostMapper.toDomain(response.data);
    } catch (error) {
      // 404인 경우 null 반환, 다른 오류는 그대로 throw
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  async create(post: Omit<Post, 'id'>): Promise<Post> {
    // Domain Entity → DTO 변환
    const createDto = PostMapper.toCreateDto(post);
    const response = await apiClient.post<PostDto>('/posts', createDto);
    
    // DTO → Domain Entity 변환
    return PostMapper.toDomain(response.data);
  }

  async update(id: number, post: Partial<Post>): Promise<Post> {
    // Domain Entity → DTO 변환
    const updateDto = PostMapper.toUpdateDto(post);
    const response = await apiClient.put<PostDto>(`/posts/${id}`, updateDto);
    
    // DTO → Domain Entity 변환
    return PostMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`);
  }
} 