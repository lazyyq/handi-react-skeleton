import type { UserResponseDto, LoginRequestDto } from '../infrastructure/dto/UserDto'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  profileImageUrl?: string
  phoneNumber?: string
  department?: string
}

export enum UserRole {
  NURSE = 'nurse',
  ADMIN = 'admin'
}

export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
} 