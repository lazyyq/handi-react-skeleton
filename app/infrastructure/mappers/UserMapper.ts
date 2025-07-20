import { User, UserFactory } from '../../domain/entities/User';
import type { UserProfile } from '../../domain/entities/User';
import { UserRole } from '../../domain/entities/User';
import type { UserDto, LoginResponseDto } from '../dto/UserDto';

// Infrastructure Layer - DTO ↔ Entity 변환
export class UserMapper {
  // DTO → Domain Entity
  static toDomain(dto: UserDto): User {
    return UserFactory.create({
      id: dto.id,
      displayName: dto.name, // API의 'name' → Domain의 'displayName'
      username: dto.username,
      email: dto.email,
      role: UserRole.USER, // API에 role이 없으므로 기본값
      isActive: true, // API에 status가 없으므로 기본값
      // JSONPlaceholder API에는 날짜 정보가 없으므로 undefined
      createdAt: undefined,
      lastLoginAt: undefined,
    });
  }

  // LoginResponse DTO → Domain Entity
  static fromLoginResponse(response: LoginResponseDto): User {
    return this.toDomain(response.user);
  }

  // Domain Entity → UserProfile (프레젠테이션용)
  static toProfile(user: User): UserProfile {
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
    };
  }

  // API 요청을 위한 변환 (필요시)
  static toUpdateDto(user: Partial<User>): Partial<UserDto> {
    const dto: Partial<UserDto> = {};
    
    if (user.displayName !== undefined) dto.name = user.displayName;
    if (user.username !== undefined) dto.username = user.username;
    if (user.email !== undefined) dto.email = user.email;
    
    return dto;
  }

  // 배열 변환 헬퍼
  static toDomainList(dtos: UserDto[]): User[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  // 프로필 배열 변환
  static toProfileList(users: User[]): UserProfile[] {
    return users.map(user => this.toProfile(user));
  }
} 