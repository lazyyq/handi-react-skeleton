import { Row, Col, Statistic, Table, Calendar, Badge, Spin } from 'antd'
import { UserOutlined, CalendarOutlined, VideoCameraOutlined, HeartOutlined } from '@ant-design/icons'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card } from '../../components/atoms'
import { PatientCard } from './components/PatientCard'
import { useAuthStore } from '../../stores/authStore'
import { usePatients, usePatientStats } from '../../../features/patient/application/hooks/usePatients'
import type { Patient } from '../../../features/patient/domain/Patient'

const upcomingAppointments = [
  { time: '09:00', patient: '김환자', type: '정기 상담' },
  { time: '10:30', patient: '이할머니', type: '화상 상담' },
  { time: '14:00', patient: '박할아버지', type: '건강 체크' },
  { time: '15:30', patient: '김환자', type: '약물 상담' }
]

const appointmentColumns = [
  {
    title: '시간',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '환자',
    dataIndex: 'patient', 
    key: 'patient'
  },
  {
    title: '상담 유형',
    dataIndex: 'type',
    key: 'type'
  }
]

export default function NurseDashboard() {
  const { user } = useAuthStore()
  
  // 훅을 사용하여 환자 데이터와 통계 가져오기
  const { data: patientsData, isLoading: patientsLoading } = usePatients({
    nurseId: user?.id,
    page: 1,
    limit: 5 // 대시보드에서는 최근 5명만 표시
  })
  
  const { data: statsData, isLoading: statsLoading } = usePatientStats(user?.id)
  
  const patients = patientsData?.patients || []
  const stats = statsData || { 
    totalPatients: 0, 
    newPatientsThisMonth: 0, 
    averageAge: 0, 
    genderDistribution: { male: 0, female: 0 } 
  }

  const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = []
    
    const today = new Date()
    if (value.date() === today.getDate()) {
      listData = [
        { type: 'warning', content: '김환자 정기 상담' },
        { type: 'success', content: '이할머니 화상 상담' }
      ]
    }
    
    return listData
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value)
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge 
              status={item.type as any} 
              text={item.content}
              className="text-xs"
            />
          </li>
        ))}
      </ul>
    )
  }

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current)
    return info.originNode
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              안녕하세요, {user?.name}님! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              오늘도 환자들을 위한 따뜻한 케어를 시작해보세요
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="관리 중인 환자"
                value={statsLoading ? 0 : stats.totalPatients}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="이번 달 신규 환자"
                value={statsLoading ? 0 : stats.newPatientsThisMonth}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                loading={statsLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="이번 주 화상 상담"
                value={8}
                prefix={<VideoCameraOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="건강 상태 양호"
                value={85}
                suffix="%"
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* 내 환자 목록 */}
          <Col xs={24} lg={14}>
            <Card title="내 환자 목록" className="h-full">
              {patientsLoading ? (
                <div className="text-center py-8">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-500">환자 정보를 불러오는 중...</p>
                </div>
              ) : (
                <Row gutter={[12, 12]}>
                  {patients.map((patient) => (
                    <Col xs={24} md={12} key={patient.id}>
                      <PatientCard
                        patient={patient}
                        onClick={() => window.location.href = `/nurse/patients/${patient.id}`}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Card>
          </Col>

          {/* 오늘 일정 */}
          <Col xs={24} lg={10}>
            <Card title="오늘의 일정" className="h-full">
              <Table
                columns={appointmentColumns}
                dataSource={upcomingAppointments}
                pagination={false}
                size="small"
                rowKey="time"
              />
            </Card>
          </Col>
        </Row>

        {/* 캘린더 */}
        <Card title="상담 일정" className="mt-6">
          <Calendar cellRender={cellRender} />
        </Card>
      </div>
    </AppLayout>
  )
} 