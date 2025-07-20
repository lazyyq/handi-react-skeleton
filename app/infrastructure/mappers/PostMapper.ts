import { Post, PostFactory } from '../../domain/entities/Post';
import type { PostSummary } from '../../domain/entities/Post';
import { PostStatus } from '../../domain/entities/Post';
import type { PostDto, CreatePostDto, UpdatePostDto } from '../dto/PostDto';

// Infrastructure Layer - DTO ↔ Entity 변환
export class PostMapper {
  // DTO → Domain Entity
  static toDomain(dto: PostDto): Post {
    return PostFactory.create({
      id: dto.id,
      title: dto.title,
      content: dto.body, // API의 'body' → Domain의 'content'
      authorId: dto.userId,
      status: PostStatus.PUBLISHED, // API에 status가 없으므로 기본값
      // JSONPlaceholder API에는 날짜 정보가 없으므로 undefined
      createdAt: undefined,
      updatedAt: undefined,
    });
  }

  // Domain Entity → DTO (API 요청용)
  static toCreateDto(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): CreatePostDto {
    return {
      title: post.title,
      body: post.content, // Domain의 'content' → API의 'body'
      userId: post.authorId,
    };
  }

  static toUpdateDto(post: Partial<Post>): UpdatePostDto {
    const dto: UpdatePostDto = {};
    
    if (post.title !== undefined) dto.title = post.title;
    if (post.content !== undefined) dto.body = post.content;
    if (post.authorId !== undefined) dto.userId = post.authorId;
    
    return dto;
  }

  // 배열 변환 헬퍼
  static toDomainList(dtos: PostDto[]): Post[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  // PostSummary로 변환 (비즈니스 로직 포함)
  static toSummary(post: Post): PostSummary {
    return {
      id: post.id,
      title: post.title,
      authorId: post.authorId,
      status: post.status,
      wordCount: post.content.split(' ').filter(word => word.length > 0).length,
    };
  }

  static toSummaryList(posts: Post[]): PostSummary[] {
    return posts.map(post => this.toSummary(post));
  }
} 