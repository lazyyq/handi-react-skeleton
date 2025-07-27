import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole } from '../../domain/entities/User'
import { UserService } from '../../application/services/UserService'
import type { User, LoginCredentials, AuthState } from '../../domain/entities/User'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  refreshUserInfo: () => Promise<void>
}

const userService = UserService.getInstance()

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        
        try {
          // UserService를 통한 실제 로그인 호출
          const result = await userService.login(
            credentials.email,
            credentials.password,
            credentials.role
          )
          
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        
        try {
          // UserService를 통한 로그아웃 호출
          await userService.logout()
        } catch (error) {
          console.warn('Logout service failed:', error)
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      refreshUserInfo: async () => {
        const { isAuthenticated } = get()
        if (!isAuthenticated) return

        try {
          const updatedUser = await userService.getCurrentUser()
          set({ user: updatedUser })
        } catch (error) {
          console.error('Failed to refresh user info:', error)
          // 토큰이 만료된 경우 로그아웃 처리
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 