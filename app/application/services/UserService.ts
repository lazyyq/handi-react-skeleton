import { httpClient } from '../../infrastructure/api/httpClient'
import { UserRole, type User } from '../../domain/entities/User'
import { UserMapper } from '../mappers/UserMapper'
import type { 
  UserResponseDto, 
  LoginRequestDto, 
  LoginResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto 
} from '../../infrastructure/dto/UserDto'

export class UserService {
  private readonly basePath = '/users'
  
  // 싱글톤 인스턴스
  private static instance: UserService | null = null
  
  // 싱글톤 인스턴스 반환
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }
  
  // 생성자를 private으로 만들어 외부에서 new로 생성 불가
  private constructor() {}

  /**
   * 사용자 로그인
   */
  async login(email: string, password: string, role: UserRole): Promise<{
    user: User
    accessToken: string
    refreshToken: string
  }> {
    try {
      const loginRequest: LoginRequestDto = {
        email,
        password,
        role
      }

      const response = await httpClient.post<LoginResponseDto>('/auth/login', loginRequest)
      const { user: userDto, access_token, refresh_token } = response.data

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      const userEntity = UserMapper.toEntity(userDto)

      return {
        user: userEntity,
        accessToken: access_token,
        refreshToken: refresh_token
      }
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Login API not available, using mock data')
      
      const mockUserDto: UserResponseDto = {
        id: `${role}-user-1`,
        name: role === UserRole.NURSE ? '김간호사' : '박관리자',
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        department: role === UserRole.NURSE ? '간호부' : '관리부'
      }

      const mockToken = 'mock-access-token'
      localStorage.setItem('access_token', mockToken)

      return {
        user: UserMapper.toEntity(mockUserDto),
        accessToken: mockToken,
        refreshToken: 'mock-refresh-token'
      }
    }
  }

  /**
   * 사용자 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout API not available')
    } finally {
      // 토큰 제거
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await httpClient.get<UserResponseDto>('/auth/me')
      return UserMapper.toEntity(response.data)
    } catch (error) {
      throw new Error('Failed to get current user')
    }
  }

  /**
   * 사용자 목록 조회 (관리자 전용)
   */
  async getUsers(role?: UserRole): Promise<User[]> {
    try {
      const params = role ? { role } : {}
      const response = await httpClient.get<UserResponseDto[]>(this.basePath, { params })
      
      return UserMapper.toEntityList(response.data)
    } catch (error) {
      // API가 없는 경우 목업 데이터 반환
      console.warn('Users API not available, using mock data')
      
      const mockUsers: UserResponseDto[] = [
        {
          id: 'nurse-1',
          name: '김간호사',
          email: 'nurse1@example.com',
          role: 'nurse',
          created_at: new Date('2024-01-01').toISOString(),
          updated_at: new Date('2024-01-20').toISOString(),
          department: '간호부'
        },
        {
          id: 'nurse-2',
          name: '이간호사',
          email: 'nurse2@example.com',
          role: 'nurse',
          created_at: new Date('2024-01-05').toISOString(),
          updated_at: new Date('2024-01-18').toISOString(),
          department: '간호부'
        },
        {
          id: 'admin-1',
          name: '박관리자',
          email: 'admin1@example.com',
          role: 'admin',
          created_at: new Date('2024-01-01').toISOString(),
          updated_at: new Date('2024-01-19').toISOString(),
          department: '관리부'
        }
      ]

      const filteredUsers = role 
        ? mockUsers.filter(user => user.role === role)
        : mockUsers

      return UserMapper.toEntityList(filteredUsers)
    }
  }

  /**
   * 사용자 생성 (관리자 전용)
   */
  async createUser(userData: CreateUserRequestDto): Promise<User> {
    try {
      const response = await httpClient.post<UserResponseDto>(this.basePath, userData)
      return UserMapper.toEntity(response.data)
    } catch (error) {
      throw new Error('Failed to create user')
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(userId: string, userData: UpdateUserRequestDto): Promise<User> {
    try {
      const response = await httpClient.put<UserResponseDto>(`${this.basePath}/${userId}`, userData)
      return UserMapper.toEntity(response.data)
    } catch (error) {
      throw new Error('Failed to update user')
    }
  }

  /**
   * 사용자 삭제 (관리자 전용)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await httpClient.delete(`${this.basePath}/${userId}`)
    } catch (error) {
      throw new Error('Failed to delete user')
    }
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await httpClient.post(`${this.basePath}/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword
      })
    } catch (error) {
      throw new Error('Failed to change password')
    }
  }
} 