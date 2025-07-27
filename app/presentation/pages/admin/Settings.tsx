import { AppLayout } from '../../components/templates/AppLayout'
import { Card } from '../../components/atoms'

export default function AdminSettings() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">시스템 설정</h1>
            <p className="text-gray-600 mt-1">
              병원 관리 시스템의 설정을 관리합니다
            </p>
          </div>
        </div>

        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              설정 페이지
            </h3>
            <p className="text-gray-400">
              시스템 설정 기능이 여기에 구현됩니다
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
} 