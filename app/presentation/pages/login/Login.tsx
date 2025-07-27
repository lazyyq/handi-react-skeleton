import { Navigate } from 'react-router'
import { message } from 'antd'
import { useAuthStore } from '../../stores/authStore'
import { UserRole } from '../../../domain/entities/User'
import { AppLayout } from '../../components/templates/AppLayout'
import { LoginForm } from './LoginForm'
import type { LoginCredentials } from '../../../domain/entities/User'

export default function Login() {
  const { isAuthenticated, user, login, isLoading } = useAuthStore()

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (isAuthenticated && user) {
    if (user.role === UserRole.NURSE) {
      return <Navigate to="/nurse/dashboard" replace />
    } else if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin/hospital" replace />
    }
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials)
      message.success('로그인에 성공했습니다!')
    } catch (error) {
      message.error('로그인에 실패했습니다.')
    }
  }

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              로그인
            </h1>
            <p className="text-gray-600">
              Handi 환자 관리 서비스에 오신 것을 환영합니다
            </p>
          </div>

          <LoginForm 
            onSubmit={handleLogin}
            loading={isLoading}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              데모 계정으로 로그인하려면 임의의 이메일과 비밀번호를 입력하세요
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 