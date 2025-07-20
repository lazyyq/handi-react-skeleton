import type { User } from '../../domain/entities/User';
import { UserRole, UserFactory } from '../../domain/entities/User';
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { UserDto } from '../dto/UserDto';
import { UserMapper } from '../mappers/UserMapper';
import { apiClient } from '../../lib/apiClient';

// Infrastructure Layer - 외부 의존성(API) 구체적 구현
export class ApiAuthRepository implements AuthRepository {
  async authenticate(username: string, password: string): Promise<User> {
    // 실제 환경에서는 다음과 같이 API를 호출합니다:
    // const loginDto: LoginRequestDto = { username, password };
    // const response = await apiClient.post<LoginResponseDto>('/auth/login', loginDto);
    // return UserMapper.fromLoginResponse(response.data);
    
    // 데모용: 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // JSONPlaceholder의 user 정보를 가져와서 로그인한 것처럼 시뮬레이션
    try {
      const response = await apiClient.get<UserDto>('/users/1');
      // DTO → Domain Entity 변환
      const user = UserMapper.toDomain(response.data);
      
      // 입력받은 username으로 오버라이드 (데모용)
      return UserFactory.create({
        id: user.id,
        displayName: username,
        username: username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      });
    } catch (error) {
      // API 실패 시 기본 사용자 반환
      return UserFactory.create({
        id: 1,
        displayName: 'Test User',
        username: username,
        email: `${username}@example.com`,
        role: UserRole.USER,
        isActive: true,
      });
    }
  }

  async logout(): Promise<void> {
    // 실제 환경에서는 다음과 같이 API를 호출합니다:
    // await apiClient.post('/auth/logout');
    
    // 데모용: 로딩 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getCurrentUser(): Promise<User | null> {
    // 실제 환경에서는 저장된 토큰을 통해 현재 사용자 정보를 가져옵니다:
    // const response = await apiClient.get<UserDto>('/auth/me');
    // return UserMapper.toDomain(response.data);
    
    // 데모용: localStorage에서 사용자 정보 가져오기
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        // localStorage의 데이터가 이미 Domain Entity 형태라고 가정
        // 실제로는 DTO 형태일 수 있으므로 Mapper를 통해 변환해야 할 수 있음
        return state.user || null;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
    
    return null;
  }

  async refreshToken(): Promise<string> {
    // 실제 환경에서는 다음과 같이 토큰을 갱신합니다:
    // const response = await apiClient.post<{ token: string }>('/auth/refresh');
    // return response.data.token;
    
    // 데모용: 더미 토큰 반환
    await new Promise(resolve => setTimeout(resolve, 300));
    return 'dummy-refreshed-token';
  }
} 