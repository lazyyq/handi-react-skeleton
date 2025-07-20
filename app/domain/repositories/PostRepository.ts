import type { Post } from '../entities/Post';

// Domain Layer - 추상 인터페이스만 정의
export interface PostRepository {
  findAll(): Promise<Post[]>;
  findById(id: number): Promise<Post | null>;
  create(post: Omit<Post, 'id'>): Promise<Post>;
  update(id: number, post: Partial<Post>): Promise<Post>;
  delete(id: number): Promise<void>;
} 