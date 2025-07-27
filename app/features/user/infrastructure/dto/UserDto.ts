// API 응답용 User DTO
export interface UserResponseDto {
  id: string
  name: string
  email: string
  role: 'nurse' | 'admin'
  created_at: string // ISO 날짜 문자열
  updated_at: string
  profile_image_url?: string
  phone_number?: string
  department?: string
}

// 로그인 요청 DTO
export interface LoginRequestDto {
  email: string
  password: string
  role: 'nurse' | 'admin'
}

// 로그인 응답 DTO
export interface LoginResponseDto {
  user: UserResponseDto
  access_token: string
  refresh_token: string
  expires_in: number
}

// 사용자 생성 요청 DTO
export interface CreateUserRequestDto {
  name: string
  email: string
  password: string
  role: 'nurse' | 'admin'
  phone_number?: string
  department?: string
}

// 사용자 업데이트 요청 DTO
export interface UpdateUserRequestDto {
  name?: string
  email?: string
  phone_number?: string
  department?: string
  profile_image_url?: string
} 