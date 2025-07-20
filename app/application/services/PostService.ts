import type { PostsUseCase } from '../../domain/use-cases/posts';
import type { Post } from '../../domain/entities/Post';

// Application Layer - 의존성 주입 기반 서비스
export class PostService {
  constructor(private readonly postsUseCase: PostsUseCase) {}

  // Use Case 인터페이스 노출
  getPostsUseCase(): PostsUseCase {
    return this.postsUseCase;
  }

  // 비즈니스 로직을 위한 편의 메서드들
  async getPosts() {
    return this.postsUseCase.getPosts();
  }

  async getPost(id: number) {
    return this.postsUseCase.getPost(id);
  }

  async createPost(post: Omit<Post, 'id'>) {
    return this.postsUseCase.createPost(post);
  }

  async updatePost(id: number, post: Partial<Post>) {
    return this.postsUseCase.updatePost(id, post);
  }

  async deletePost(id: number) {
    return this.postsUseCase.deletePost(id);
  }
} 