import { httpClient } from './httpClient'
import type { 
  UserResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  CreateUserRequestDto,
  UpdateUserRequestDto
} from '../dto/UserDto'

/**
 * 사용자 관련 API 호출 함수들
 */
export const userApi = {
  /**
   * 로그인 API
   * POST /auth/login
   */
  async login(loginData: LoginRequestDto): Promise<LoginResponseDto> {
    const response = await httpClient.post<LoginResponseDto>('/auth/login', loginData)
    return response.data
  },

  /**
   * 로그아웃 API
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    await httpClient.post('/auth/logout')
  },

  /**
   * 현재 사용자 정보 조회 API
   * GET /auth/me
   */
  async getCurrentUser(): Promise<UserResponseDto> {
    const response = await httpClient.get<UserResponseDto>('/auth/me')
    return response.data
  },

  /**
   * 토큰 갱신 API
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<{
    access_token: string
    refresh_token: string
    expires_in: number
  }> {
    const response = await httpClient.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response.data
  },

  /**
   * 사용자 목록 조회 API (관리자 전용)
   * GET /users
   */
  async getUsers(params?: {
    role?: 'nurse' | 'admin'
    page?: number
    limit?: number
    search?: string
  }): Promise<{
    data: UserResponseDto[]
    total: number
    page: number
    limit: number
    total_pages: number
  }> {
    const response = await httpClient.get('/users', { params })
    return response.data
  },

  /**
   * 특정 사용자 조회 API
   * GET /users/:id
   */
  async getUser(userId: string): Promise<UserResponseDto> {
    const response = await httpClient.get<UserResponseDto>(`/users/${userId}`)
    return response.data
  },

  /**
   * 사용자 생성 API (관리자 전용)
   * POST /users
   */
  async createUser(userData: CreateUserRequestDto): Promise<UserResponseDto> {
    const response = await httpClient.post<UserResponseDto>('/users', userData)
    return response.data
  },

  /**
   * 사용자 정보 업데이트 API
   * PUT /users/:id
   */
  async updateUser(userId: string, userData: UpdateUserRequestDto): Promise<UserResponseDto> {
    const response = await httpClient.put<UserResponseDto>(`/users/${userId}`, userData)
    return response.data
  },

  /**
   * 사용자 삭제 API (관리자 전용)
   * DELETE /users/:id
   */
  async deleteUser(userId: string): Promise<void> {
    await httpClient.delete(`/users/${userId}`)
  },

  /**
   * 비밀번호 변경 API
   * POST /users/:id/change-password
   */
  async changePassword(userId: string, passwordData: {
    current_password: string
    new_password: string
  }): Promise<void> {
    await httpClient.post(`/users/${userId}/change-password`, passwordData)
  },

  /**
   * 프로필 이미지 업로드 API
   * POST /users/:id/profile-image
   */
  async uploadProfileImage(userId: string, imageFile: File): Promise<{
    profile_image_url: string
  }> {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await httpClient.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * 사용자 활동 로그 조회 API
   * GET /users/:id/activity-logs
   */
  async getUserActivityLogs(userId: string, params?: {
    page?: number
    limit?: number
    from_date?: string
    to_date?: string
  }): Promise<{
    data: Array<{
      id: string
      user_id: string
      action: string
      resource: string
      details: Record<string, any>
      ip_address: string
      user_agent: string
      created_at: string
    }>
    total: number
    page: number
    total_pages: number
  }> {
    const response = await httpClient.get(`/users/${userId}/activity-logs`, { params })
    return response.data
  }
}

/**
 * API 응답 예시:
 * 
 * Login Response:
 * {
 *   "user": {
 *     "id": "nurse-123",
 *     "name": "김간호사",
 *     "email": "nurse@example.com",
 *     "role": "nurse",
 *     "created_at": "2024-01-01T00:00:00Z",
 *     "updated_at": "2024-01-20T00:00:00Z",
 *     "department": "간호부",
 *     "phone_number": "010-1234-5678"
 *   },
 *   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "expires_in": 3600
 * }
 * 
 * Users List Response:
 * {
 *   "data": [
 *     {
 *       "id": "nurse-1",
 *       "name": "김간호사",
 *       "email": "nurse1@example.com",
 *       "role": "nurse",
 *       "created_at": "2024-01-01T00:00:00Z",
 *       "updated_at": "2024-01-20T00:00:00Z",
 *       "department": "간호부"
 *     }
 *   ],
 *   "total": 10,
 *   "page": 1,
 *   "limit": 10,
 *   "total_pages": 1
 * }
 */ 