import type { AuthUseCase } from '../../domain/use-cases/auth';

// Application Layer - 의존성 주입 기반 서비스
export class AuthService {
  constructor(private readonly authUseCase: AuthUseCase) {}

  // Use Case 인터페이스 노출
  getAuthUseCase(): AuthUseCase {
    return this.authUseCase;
  }

  // 비즈니스 로직을 위한 편의 메서드들
  async login(username: string, password: string) {
    return this.authUseCase.login(username, password);
  }

  async logout() {
    return this.authUseCase.logout();
  }

  async getCurrentUser() {
    return this.authUseCase.getCurrentUser();
  }
} 