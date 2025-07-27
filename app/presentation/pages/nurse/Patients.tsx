import { useState } from 'react'
import { Row, Col, Input as AntInput, Table, Tag, Spin, Alert } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card } from '../../components/atoms'
import { PatientCard } from './components/PatientCard'
import { usePatients } from '../../../features/patient/application/hooks/usePatients'
import { useAuthStore } from '../../stores/authStore'
import type { Patient } from '../../../features/patient/domain/Patient'

export default function Patients() {
  const [searchText, setSearchText] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const { user } = useAuthStore()
  
  // 훅을 사용하여 환자 데이터 가져오기
  const { data: patientsData, isLoading, error } = usePatients({
    nurseId: user?.id,
    page: 1,
    limit: 100
  })
  
  const patients = patientsData?.patients || []
  
  // 로컬 검색 필터링
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
    patient.phoneNumber.includes(searchText) ||
    patient.address.toLowerCase().includes(searchText.toLowerCase())
  )

  const tableColumns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Patient) => (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span className="font-medium">{name}</span>
          <Tag color={record.gender === 'male' ? 'blue' : 'pink'}>
            {record.gender === 'male' ? '남성' : '여성'}
          </Tag>
        </div>
      )
    },
    {
      title: '나이',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => `${age}세`
    },
    {
      title: '연락처',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: '주소',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '등록일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString('ko-KR')
    },
    {
      title: '작업',
      key: 'actions',
      render: (_: any, record: Patient) => (
        <a 
          href={`/nurse/patients/${record.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          상세보기
        </a>
      )
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">환자 관리</h1>
            <p className="text-gray-600 mt-1">
              담당 환자들의 정보를 관리하고 건강 상태를 확인하세요
            </p>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AntInput
                placeholder="환자 이름, 연락처, 주소로 검색"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-80"
                size="large"
              />
              <div className="text-sm text-gray-500">
                총 {filteredPatients.length}명
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'card' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                카드뷰
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'table' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                테이블뷰
              </button>
            </div>
          </div>
        </Card>

        {/* 로딩 상태 */}
        {isLoading && (
          <Card>
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="mt-4 text-gray-500">환자 정보를 불러오는 중...</p>
            </div>
          </Card>
        )}

        {/* 에러 상태 */}
        {error && (
          <Alert
            message="데이터 로딩 실패"
            description="환자 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* 환자 목록 */}
        {!isLoading && !error && (
          <>
            {viewMode === 'card' ? (
              <Row gutter={[16, 16]}>
                {filteredPatients.map((patient) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={patient.id}>
                    <PatientCard
                      patient={patient}
                      onClick={() => window.location.href = `/nurse/patients/${patient.id}`}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Card>
                <Table
                  columns={tableColumns}
                  dataSource={filteredPatients}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )}
          </>
        )}

        {filteredPatients.length === 0 && searchText && (
          <Card>
            <div className="text-center py-8">
              <UserOutlined className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-400">
                다른 검색어로 다시 시도해보세요
              </p>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
} 