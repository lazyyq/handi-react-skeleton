import { UserRole, type User } from '../../domain/User'
import type { UserResponseDto } from '../../infrastructure/dto/UserDto'

/**
 * UserMapper
 * 사용자 엔티티와 DTO 간의 데이터 변환을 담당
 */
export class UserMapper {
  /**
   * UserResponseDto를 User로 변환
   */
  static toEntity(dto: UserResponseDto): User {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      role: dto.role as UserRole,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
      profileImageUrl: dto.profile_image_url,
      phoneNumber: dto.phone_number,
      department: dto.department
    }
  }

  /**
   * User를 UserResponseDto로 변환
   */
  static toDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
      profile_image_url: entity.profileImageUrl,
      phone_number: entity.phoneNumber,
      department: entity.department
    }
  }

  /**
   * UserResponseDto 배열을 User 배열로 변환
   */
  static toEntityList(dtos: UserResponseDto[]): User[] {
    return dtos.map(this.toEntity)
  }

  /**
   * User 배열을 UserResponseDto 배열로 변환
   */
  static toDtoList(entities: User[]): UserResponseDto[] {
    return entities.map(this.toDto)
  }
} 