import { Navigate } from 'react-router'
import { useAuthStore } from '../../stores/authStore'
import { UserRole } from '../../../features/user/domain/User'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card, Button } from '../../components/atoms'

export default function Home() {
  const { isAuthenticated, user } = useAuthStore()

  // 로그인된 사용자는 각자의 대시보드로 리다이렉트
  if (isAuthenticated && user) {
    if (user.role === UserRole.NURSE) {
      return <Navigate to="/nurse/dashboard" replace />
    } else if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin/hospital" replace />
    }
  }

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl w-full px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Handi
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              환자 관리 서비스
            </p>
            <p className="text-lg text-gray-500">
              간호사와 환자를 연결하는 스마트한 헬스케어 플랫폼
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">👩‍⚕️</div>
              <h3 className="text-xl font-semibold mb-3">간호사 모드</h3>
              <p className="text-gray-600 mb-6">
                환자 관리, 상담 일정 관리, 화상 상담을 통해 
                효율적으로 환자 케어를 제공하세요
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• 환자 건강 데이터 모니터링</li>
                <li>• 상담 일정 관리</li>
                <li>• 화상 상담 서비스</li>
                <li>• 환자별 맞춤 케어</li>
              </ul>
            </Card>

            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold mb-3">관리자 모드</h3>
              <p className="text-gray-600 mb-6">
                병원 전체 운영 현황을 한눈에 파악하고
                체계적으로 관리하세요
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-2">
                <li>• 간호사 관리</li>
                <li>• 환자 현황 종합 관리</li>
                <li>• 시스템 설정</li>
                <li>• 운영 현황 대시보드</li>
              </ul>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="large" 
              className="px-8 py-2 h-12 text-lg"
              href="/login"
            >
              로그인하여 시작하기
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 