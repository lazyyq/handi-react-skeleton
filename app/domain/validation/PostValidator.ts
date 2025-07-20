import { RequiredFieldError, MinLengthError, InvalidFormatError } from '../errors/DomainError';

// Domain Layer - 게시글 관련 검증 로직
export class PostValidator {
  private static readonly MIN_TITLE_LENGTH = 1;
  private static readonly MAX_TITLE_LENGTH = 200;
  private static readonly MIN_CONTENT_LENGTH = 10;
  private static readonly MAX_CONTENT_LENGTH = 10000;

  static validateTitle(title: string): void {
    if (!title) {
      throw new RequiredFieldError('title');
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new RequiredFieldError('title');
    }

    if (trimmedTitle.length < this.MIN_TITLE_LENGTH) {
      throw new MinLengthError('title', this.MIN_TITLE_LENGTH, trimmedTitle.length);
    }

    if (trimmedTitle.length > this.MAX_TITLE_LENGTH) {
      throw new InvalidFormatError('title', `maximum ${this.MAX_TITLE_LENGTH} characters`);
    }
  }

  static validateContent(content: string): void {
    if (!content) {
      throw new RequiredFieldError('content');
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new RequiredFieldError('content');
    }

    if (trimmedContent.length < this.MIN_CONTENT_LENGTH) {
      throw new MinLengthError('content', this.MIN_CONTENT_LENGTH, trimmedContent.length);
    }

    if (trimmedContent.length > this.MAX_CONTENT_LENGTH) {
      throw new InvalidFormatError('content', `maximum ${this.MAX_CONTENT_LENGTH} characters`);
    }
  }

  static validateAuthorId(authorId: number): void {
    if (!authorId) {
      throw new RequiredFieldError('authorId');
    }

    if (authorId <= 0) {
      throw new InvalidFormatError('authorId', 'positive number');
    }
  }

  static validatePostId(postId: number): void {
    if (!postId) {
      throw new RequiredFieldError('postId');
    }

    if (postId <= 0) {
      throw new InvalidFormatError('postId', 'positive number');
    }
  }
} 