import type { Post } from '../entities/Post';
import type { PostRepository } from '../repositories/PostRepository';
import { PostValidator } from '../validation/PostValidator';
import { ResourceNotFoundError, BusinessRuleViolationError } from '../errors/DomainError';
import { PostFactory } from '../entities/Post';

// Domain Layer - 비즈니스 로직만 포함, Infrastructure 의존성 없음
export interface PostsUseCase {
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post>;
  createPost(post: Omit<Post, 'id'>): Promise<Post>;
  updatePost(id: number, post: Partial<Post>): Promise<Post>;
  deletePost(id: number): Promise<void>;
}

export class PostsUseCaseImpl implements PostsUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await this.postRepository.findAll();
      
      // 비즈니스 로직: 정렬 (최신순)
      return posts.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } catch (error) {
      console.error('Failed to get posts:', error);
      throw new BusinessRuleViolationError('Failed to retrieve posts');
    }
  }

  async getPost(id: number): Promise<Post> {
    PostValidator.validatePostId(id);
    
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new ResourceNotFoundError('Post', id);
    }
    
    return post;
  }

  async createPost(postData: Omit<Post, 'id'>): Promise<Post> {
    // 도메인 검증
    PostValidator.validateTitle(postData.title);
    PostValidator.validateContent(postData.content);
    PostValidator.validateAuthorId(postData.authorId);
    
    try {
      // 도메인 엔티티 생성 (검증 포함)
      const post = PostFactory.createNew({
        title: postData.title.trim(),
        content: postData.content.trim(),
        authorId: postData.authorId,
        status: postData.status
      });
      
      // Repository를 통한 저장
      return await this.postRepository.create(post);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw new BusinessRuleViolationError('Failed to create post');
    }
  }

  async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    PostValidator.validatePostId(id);
    
    // 기존 게시글 존재 확인
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new ResourceNotFoundError('Post', id);
    }
    
    // 부분 검증 (업데이트되는 필드만)
    if (postData.title !== undefined) {
      PostValidator.validateTitle(postData.title);
    }
    if (postData.content !== undefined) {
      PostValidator.validateContent(postData.content);
    }
    if (postData.authorId !== undefined) {
      PostValidator.validateAuthorId(postData.authorId);
    }
    
    try {
      // 도메인 비즈니스 로직 적용
      let updatedPost = existingPost;
      
      if (postData.title !== undefined) {
        updatedPost = updatedPost.updateTitle(postData.title.trim());
      }
      
      if (postData.content !== undefined) {
        updatedPost = updatedPost.updateContent(postData.content.trim());
      }
      
      // Repository를 통한 업데이트
      return await this.postRepository.update(id, updatedPost);
    } catch (error) {
      console.error('Failed to update post:', error);
      throw new BusinessRuleViolationError('Failed to update post');
    }
  }

  async deletePost(id: number): Promise<void> {
    PostValidator.validatePostId(id);
    
    // 기존 게시글 존재 확인
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) {
      throw new ResourceNotFoundError('Post', id);
    }
    
    // 비즈니스 로직: 아카이브된 게시글은 삭제 불가
    if (existingPost.isArchived()) {
      throw new BusinessRuleViolationError('Archived posts cannot be deleted');
    }
    
    try {
      await this.postRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw new BusinessRuleViolationError('Failed to delete post');
    }
  }
} 