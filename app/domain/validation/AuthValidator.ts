import { RequiredFieldError, MinLengthError, InvalidFormatError } from '../errors/DomainError';

// Domain Layer - 인증 관련 검증 로직
export class AuthValidator {
  private static readonly MIN_USERNAME_LENGTH = 2;
  private static readonly MAX_USERNAME_LENGTH = 30;
  private static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static validateUsername(username: string): void {
    if (!username) {
      throw new RequiredFieldError('username');
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      throw new RequiredFieldError('username');
    }

    if (trimmedUsername.length < this.MIN_USERNAME_LENGTH) {
      throw new MinLengthError('username', this.MIN_USERNAME_LENGTH, trimmedUsername.length);
    }

    if (trimmedUsername.length > this.MAX_USERNAME_LENGTH) {
      throw new InvalidFormatError('username', `maximum ${this.MAX_USERNAME_LENGTH} characters`);
    }

    // 사용자명 형식 검증 (영문, 숫자, 언더스코어만 허용)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      throw new InvalidFormatError('username', 'alphanumeric characters and underscores only');
    }
  }

  static validatePassword(password: string): void {
    if (!password) {
      throw new RequiredFieldError('password');
    }

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      throw new MinLengthError('password', this.MIN_PASSWORD_LENGTH, password.length);
    }

    // 비밀번호 강도 검증 (최소 하나의 문자와 숫자 포함)
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
      throw new InvalidFormatError('password', 'at least one letter and one number');
    }
  }

  static validateEmail(email: string): void {
    if (!email) {
      throw new RequiredFieldError('email');
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      throw new RequiredFieldError('email');
    }

    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      throw new InvalidFormatError('email', 'valid email address');
    }
  }

  static validateDisplayName(displayName: string): void {
    if (!displayName) {
      throw new RequiredFieldError('displayName');
    }

    const trimmedDisplayName = displayName.trim();
    if (!trimmedDisplayName) {
      throw new RequiredFieldError('displayName');
    }

    if (trimmedDisplayName.length < 1) {
      throw new MinLengthError('displayName', 1, trimmedDisplayName.length);
    }

    if (trimmedDisplayName.length > 100) {
      throw new InvalidFormatError('displayName', 'maximum 100 characters');
    }
  }
} 