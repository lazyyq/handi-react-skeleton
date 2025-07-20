import type { User } from '../entities/User';
import type { AuthRepository } from '../repositories/AuthRepository';
import { AuthValidator } from '../validation/AuthValidator';
import { InvalidCredentialsError, BusinessRuleViolationError } from '../errors/DomainError';

// Domain Layer - 비즈니스 로직만 포함, Infrastructure 의존성 없음
export interface AuthUseCase {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class AuthUseCaseImpl implements AuthUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(username: string, password: string): Promise<User> {
    // 도메인 검증 로직
    AuthValidator.validateUsername(username);
    AuthValidator.validatePassword(password);

    try {
      // Repository를 통한 인증
      const user = await this.authRepository.authenticate(username.trim(), password);
      
      // 사용자 활성 상태 검증
      user.validateActive();
      
      // 로그인 시간 업데이트
      const updatedUser = user.updateLastLogin();
      
      // 비즈니스 로직: 로그인 성공 후 처리
      console.log(`User ${updatedUser.displayName} logged in successfully`);
      
      return updatedUser;
    } catch (error) {
      // Repository에서 발생한 에러를 도메인 에러로 변환
      if (error instanceof Error) {
        throw new InvalidCredentialsError('Invalid username or password');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // 비즈니스 로직: 로그아웃 전 정리 작업
      console.log('Logging out user...');
      
      await this.authRepository.logout();
      
      // 비즈니스 로직: 로그아웃 후 정리 작업
      console.log('User logged out successfully');
    } catch (error) {
      // 로그아웃 실패 시에도 로그만 출력하고 에러는 재발생시키지 않음
      console.error('Logout failed:', error);
      throw new BusinessRuleViolationError('Failed to logout properly');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await this.authRepository.getCurrentUser();
      
      // 사용자가 있으면 활성 상태 확인
      if (user) {
        user.validateActive();
      }
      
      return user;
    } catch (error) {
      // 사용자 조회 실패 시 null 반환
      console.error('Failed to get current user:', error);
      return null;
    }
  }
} 