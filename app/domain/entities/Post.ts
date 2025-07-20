import { BusinessRuleViolationError, ValidationError } from '../errors/DomainError';

// Domain Layer - 순수한 비즈니스 모델 (API와 무관)
export class Post {
  constructor(
    public readonly id: PostId,
    public readonly title: PostTitle,
    public readonly content: PostContent,
    public readonly authorId: UserId,
    public readonly status: PostStatus,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    this.validateTitle(title);
    this.validateContent(content);
  }

  // 비즈니스 로직 메서드들
  isPublished(): boolean {
    return this.status === PostStatus.PUBLISHED;
  }

  isDraft(): boolean {
    return this.status === PostStatus.DRAFT;
  }

  isArchived(): boolean {
    return this.status === PostStatus.ARCHIVED;
  }

  canBeEdited(): boolean {
    return this.status !== PostStatus.ARCHIVED;
  }

  canBePublished(): boolean {
    return this.status === PostStatus.DRAFT;
  }

  canBeArchived(): boolean {
    return this.status === PostStatus.PUBLISHED;
  }

  getWordCount(): number {
    return this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  getReadingTime(): number {
    const wordsPerMinute = 200; // 평균 읽기 속도
    const wordCount = this.getWordCount();
    return Math.ceil(wordCount / wordsPerMinute);
  }

  isLongPost(): boolean {
    return this.getWordCount() > 1000;
  }

  private validateTitle(title: string): void {
    if (!title.trim()) {
      throw new ValidationError('Post title cannot be empty');
    }
    if (title.length > 200) {
      throw new ValidationError('Post title cannot exceed 200 characters');
    }
  }

  private validateContent(content: string): void {
    if (!content.trim()) {
      throw new ValidationError('Post content cannot be empty');
    }
    if (content.length < 10) {
      throw new ValidationError('Post content must be at least 10 characters long');
    }
  }

  updateTitle(newTitle: PostTitle): Post {
    this.validateTitle(newTitle);
    
    if (!this.canBeEdited()) {
      throw new BusinessRuleViolationError('Archived posts cannot be edited');
    }

    return new Post(
      this.id,
      newTitle.trim(),
      this.content,
      this.authorId,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  updateContent(newContent: PostContent): Post {
    this.validateContent(newContent);
    
    if (!this.canBeEdited()) {
      throw new BusinessRuleViolationError('Archived posts cannot be edited');
    }

    return new Post(
      this.id,
      this.title,
      newContent.trim(),
      this.authorId,
      this.status,
      this.createdAt,
      new Date()
    );
  }

  publish(): Post {
    if (!this.canBePublished()) {
      throw new BusinessRuleViolationError('Only draft posts can be published');
    }

    return new Post(
      this.id,
      this.title,
      this.content,
      this.authorId,
      PostStatus.PUBLISHED,
      this.createdAt,
      new Date()
    );
  }

  archive(): Post {
    if (!this.canBeArchived()) {
      throw new BusinessRuleViolationError('Only published posts can be archived');
    }

    return new Post(
      this.id,
      this.title,
      this.content,
      this.authorId,
      PostStatus.ARCHIVED,
      this.createdAt,
      new Date()
    );
  }

  unpublish(): Post {
    if (!this.isPublished()) {
      throw new BusinessRuleViolationError('Only published posts can be unpublished');
    }

    return new Post(
      this.id,
      this.title,
      this.content,
      this.authorId,
      PostStatus.DRAFT,
      this.createdAt,
      new Date()
    );
  }
}

// Value Objects (도메인 주도 설계)
export type PostId = number;
export type PostTitle = string;
export type PostContent = string;
export type UserId = number;

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// 비즈니스 로직을 위한 인터페이스
export interface PostSummary {
  readonly id: PostId;
  readonly title: PostTitle;
  readonly authorId: UserId;
  readonly status: PostStatus;
  readonly wordCount: number;
}

// Domain Service에서 사용할 수 있는 팩토리
export class PostFactory {
  static create(params: {
    id?: PostId;
    title: PostTitle;
    content: PostContent;
    authorId: UserId;
    status?: PostStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): Post {
    return new Post(
      params.id || 0,
      params.title,
      params.content,
      params.authorId,
      params.status || PostStatus.DRAFT,
      params.createdAt,
      params.updatedAt
    );
  }

  static createNew(params: {
    title: PostTitle;
    content: PostContent;
    authorId: UserId;
    status?: PostStatus;
  }): Post {
    const now = new Date();
    return new Post(
      0, // 임시 ID
      params.title,
      params.content,
      params.authorId,
      params.status || PostStatus.DRAFT,
      now,
      undefined
    );
  }

  static createSummary(post: Post): PostSummary {
    return {
      id: post.id,
      title: post.title,
      authorId: post.authorId,
      status: post.status,
      wordCount: post.getWordCount(),
    };
  }
} 