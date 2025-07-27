import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService } from '../services/UserService'
import { UserRole } from '../../domain/User'
import type { CreateUserRequestDto, UpdateUserRequestDto } from '../../infrastructure/dto/UserDto'

const userService = UserService.getInstance()

/**
 * 사용자 목록 조회 훅 (관리자 전용)
 */
export const useUsers = (role?: UserRole) => {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => userService.getUsers(role),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  })
}

/**
 * 현재 사용자 정보 조회 훅
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => userService.getCurrentUser(),
    staleTime: 10 * 60 * 1000, // 10분
    retry: false, // 인증 실패 시 재시도하지 않음
  })
}

/**
 * 사용자 생성 뮤테이션 훅 (관리자 전용)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: CreateUserRequestDto) => 
      userService.createUser(userData),
    onSuccess: () => {
      // 사용자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * 사용자 정보 업데이트 뮤테이션 훅
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, userData }: {
      userId: string
      userData: UpdateUserRequestDto
    }) => userService.updateUser(userId, userData),
    onSuccess: (updatedUser) => {
      // 현재 사용자가 업데이트된 경우 currentUser 쿼리도 업데이트
      queryClient.setQueryData(['currentUser'], updatedUser)
      // 사용자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * 사용자 삭제 뮤테이션 훅 (관리자 전용)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      // 사용자 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * 비밀번호 변경 뮤테이션 훅
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, currentPassword, newPassword }: {
      userId: string
      currentPassword: string
      newPassword: string
    }) => userService.changePassword(userId, currentPassword, newPassword),
  })
}

/**
 * 로그인 뮤테이션 훅
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password, role }: {
      email: string
      password: string
      role: UserRole
    }) => userService.login(email, password, role),
    onSuccess: (result) => {
      // 로그인 성공 시 currentUser 쿼리 설정
      queryClient.setQueryData(['currentUser'], result.user)
    },
  })
}

/**
 * 로그아웃 뮤테이션 훅
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: () => {
      // 로그아웃 시 모든 쿼리 캐시 클리어
      queryClient.clear()
    },
  })
} 