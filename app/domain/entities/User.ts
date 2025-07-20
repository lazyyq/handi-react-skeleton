import { InsufficientPermissionError, BusinessRuleViolationError } from '../errors/DomainError';

// Domain Layer - 순수한 비즈니스 모델 (API와 무관)
export class User {
  constructor(
    public readonly id: UserId,
    public readonly displayName: string,
    public readonly username: Username,
    public readonly email: EmailAddress,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt?: Date,
    public readonly lastLoginAt?: Date
  ) {}

  // 비즈니스 로직 메서드들
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canModerate(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.MODERATOR;
  }

  canManageUsers(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canEditPost(postAuthorId: UserId): boolean {
    return this.id === postAuthorId || this.canModerate();
  }

  canDeletePost(postAuthorId: UserId): boolean {
    return this.id === postAuthorId || this.canModerate();
  }

  hasPermission(permission: UserPermission): boolean {
    const rolePermissions = this.getRolePermissions();
    return rolePermissions.includes(permission);
  }

  private getRolePermissions(): UserPermission[] {
    switch (this.role) {
      case UserRole.ADMIN:
        return [
          UserPermission.READ_POSTS,
          UserPermission.CREATE_POSTS,
          UserPermission.EDIT_ALL_POSTS,
          UserPermission.DELETE_ALL_POSTS,
          UserPermission.MANAGE_USERS,
          UserPermission.MODERATE_CONTENT,
        ];
      case UserRole.MODERATOR:
        return [
          UserPermission.READ_POSTS,
          UserPermission.CREATE_POSTS,
          UserPermission.EDIT_ALL_POSTS,
          UserPermission.DELETE_ALL_POSTS,
          UserPermission.MODERATE_CONTENT,
        ];
      case UserRole.USER:
        return [
          UserPermission.READ_POSTS,
          UserPermission.CREATE_POSTS,
        ];
      default:
        return [];
    }
  }

  validatePermission(permission: UserPermission): void {
    if (!this.hasPermission(permission)) {
      throw new InsufficientPermissionError(permission);
    }
  }

  validateActive(): void {
    if (!this.isActive) {
      throw new BusinessRuleViolationError('User account is inactive');
    }
  }

  updateDisplayName(newDisplayName: string): User {
    if (!newDisplayName.trim()) {
      throw new BusinessRuleViolationError('Display name cannot be empty');
    }
    
    return new User(
      this.id,
      newDisplayName.trim(),
      this.username,
      this.email,
      this.role,
      this.isActive,
      this.createdAt,
      this.lastLoginAt
    );
  }

  deactivate(): User {
    if (!this.isActive) {
      throw new BusinessRuleViolationError('User is already inactive');
    }

    return new User(
      this.id,
      this.displayName,
      this.username,
      this.email,
      this.role,
      false,
      this.createdAt,
      this.lastLoginAt
    );
  }

  activate(): User {
    if (this.isActive) {
      throw new BusinessRuleViolationError('User is already active');
    }

    return new User(
      this.id,
      this.displayName,
      this.username,
      this.email,
      this.role,
      true,
      this.createdAt,
      this.lastLoginAt
    );
  }

  updateLastLogin(loginTime: Date = new Date()): User {
    return new User(
      this.id,
      this.displayName,
      this.username,
      this.email,
      this.role,
      this.isActive,
      this.createdAt,
      loginTime
    );
  }
}

// Value Objects (도메인 주도 설계)
export type UserId = number;
export type Username = string;
export type EmailAddress = string;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export enum UserPermission {
  READ_POSTS = 'read_posts',
  CREATE_POSTS = 'create_posts',
  EDIT_ALL_POSTS = 'edit_all_posts',
  DELETE_ALL_POSTS = 'delete_all_posts',
  MANAGE_USERS = 'manage_users',
  MODERATE_CONTENT = 'moderate_content'
}

// 인증 관련 Domain Model
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  sessionExpiresAt?: Date;
}

export interface UserProfile {
  readonly id: UserId;
  readonly displayName: string;
  readonly username: Username;
  readonly email: EmailAddress;
  readonly bio?: string;
  readonly avatar?: string;
}

// Domain Service에서 사용할 수 있는 팩토리
export class UserFactory {
  static create(params: {
    id?: UserId;
    displayName: string;
    username: Username;
    email: EmailAddress;
    role?: UserRole;
    isActive?: boolean;
    createdAt?: Date;
    lastLoginAt?: Date;
  }): User {
    return new User(
      params.id || 0,
      params.displayName,
      params.username,
      params.email,
      params.role || UserRole.USER,
      params.isActive ?? true,
      params.createdAt,
      params.lastLoginAt
    );
  }

  static createNew(params: {
    displayName: string;
    username: Username;
    email: EmailAddress;
    role?: UserRole;
  }): Omit<User, 'id'> {
    const now = new Date();
    return new User(
      0, // 임시 ID
      params.displayName,
      params.username,
      params.email,
      params.role || UserRole.USER,
      true,
      now,
      undefined
    );
  }

  static createProfile(user: User): UserProfile {
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
    };
  }
} 