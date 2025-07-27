import { Row, Col, Statistic, Table, Tag, Tabs, Spin } from 'antd'
import { UserOutlined, TeamOutlined, HeartOutlined, CalendarOutlined } from '@ant-design/icons'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card } from '../../components/atoms'
import { useUsers } from '../../../features/user/application/hooks/useUsers'
import { usePatients } from '../../../features/patient/application/hooks/usePatients'
import { UserRole } from '../../../features/user/domain/User'
import type { User } from '../../../features/user/domain/User'
import type { Patient } from '../../../features/patient/domain/Patient'

export default function AdminHospital() {
  // 훅을 사용하여 간호사와 환자 데이터 가져오기
  const { data: nurses = [], isLoading: nursesLoading } = useUsers(UserRole.NURSE)
  const { data: patientsData, isLoading: patientsLoading } = usePatients()
  
  const patients = patientsData?.patients || []
  
  // 간호사별 환자 수 계산
  const nursePatientCounts = nurses.map(nurse => ({
    nurseId: nurse.id,
    nurseName: nurse.name,
    patientCount: patients.filter(p => p.nurseId === nurse.id).length
  }))
  
  // 환자 데이터에 간호사 이름 추가
  const patientsWithNurseNames = patients.map(patient => {
    const nurse = nurses.find(n => n.id === patient.nurseId)
    return {
      ...patient,
      nurseName: nurse?.name || '미배정'
    }
  })
  const nurseColumns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: '담당 환자 수',
      key: 'patientCount',
      render: (_: any, record: User) => {
        const patientCount = patients.filter(p => p.nurseId === record.id).length
        return (
          <Tag color={patientCount > 2 ? 'red' : patientCount > 1 ? 'orange' : 'green'}>
            {patientCount}명
          </Tag>
        )
      }
    },
    {
      title: '등록일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString('ko-KR')
    },
    {
      title: '상태',
      key: 'status',
      render: () => <Tag color="success">활성</Tag>
    }
  ]

  const patientColumns = [
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Patient & { nurseName: string }) => (
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
      title: '담당 간호사',
      dataIndex: 'nurseName',
      key: 'nurseName',
      render: (nurseName: string) => (
        <Tag color="processing">{nurseName}</Tag>
      )
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
    }
  ]

  const tabItems = [
    {
      key: '1',
      label: '간호사 관리',
      children: (
        <Table
          columns={nurseColumns}
          dataSource={nurses}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={nursesLoading}
        />
      )
    },
    {
      key: '2',
      label: '환자 현황',
      children: (
        <Table
          columns={patientColumns}
          dataSource={patientsWithNurseNames}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={patientsLoading}
        />
      )
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">병원 관리</h1>
            <p className="text-gray-600 mt-1">
              병원 전체 운영 현황을 관리하고 모니터링하세요
            </p>
          </div>
        </div>

        {/* 통계 개요 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="등록된 간호사"
                value={nurses.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix="명"
                loading={nursesLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="전체 환자"
                value={patients.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
                suffix="명"
                loading={patientsLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="오늘 상담"
                value={12}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix="건"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="시스템 가동률"
                value={99.8}
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#cf1322' }}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* 간호사별 환자 배정 현황 */}
        <Card title="간호사별 환자 배정 현황">
          <Row gutter={[16, 16]}>
            {nurses.map(nurse => {
              const assignedPatients = patients.filter(p => p.nurseId === nurse.id)
              return (
                <Col xs={24} md={8} key={nurse.id}>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <UserOutlined className="text-blue-600" />
                        <span className="font-medium">{nurse.name}</span>
                      </div>
                      <Tag color={assignedPatients.length > 2 ? 'red' : assignedPatients.length > 1 ? 'orange' : 'green'}>
                        {assignedPatients.length}명
                      </Tag>
                    </div>
                    <div className="text-sm text-gray-600">
                      {assignedPatients.length > 0 ? (
                        <div className="space-y-1">
                          {assignedPatients.slice(0, 3).map(patient => (
                            <div key={patient.id} className="flex justify-between">
                              <span>{patient.name}</span>
                              <span className="text-gray-500">{patient.age}세</span>
                            </div>
                          ))}
                          {assignedPatients.length > 3 && (
                            <div className="text-gray-500 text-xs">
                              외 {assignedPatients.length - 3}명
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400">배정된 환자가 없습니다</div>
                      )}
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Card>

        {/* 상세 관리 탭 */}
        <Card>
          <Tabs items={tabItems} />
        </Card>
      </div>
    </AppLayout>
  )
} 