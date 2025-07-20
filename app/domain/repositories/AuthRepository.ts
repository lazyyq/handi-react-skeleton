import type { User } from '../entities/User';

// Domain Layer - 추상 인터페이스만 정의
export interface AuthRepository {
  authenticate(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<string>;
} 