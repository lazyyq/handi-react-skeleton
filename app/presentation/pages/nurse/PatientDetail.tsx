import { useParams } from 'react-router'
import { Row, Col, Descriptions, Timeline, Tabs, Spin, Alert } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { UserOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card, Button } from '../../components/atoms'
import { usePatient, usePatientHealthRecords } from '../../../features/patient/application/hooks/usePatients'
import type { Patient, HealthRecord } from '../../../features/patient/domain/Patient'

export default function PatientDetail() {
  const { id } = useParams()

  // 훅을 사용하여 환자 정보와 건강 기록 가져오기
  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(id || '')
  const { data: healthRecords = [], isLoading: recordsLoading, error: recordsError } = usePatientHealthRecords(id || '', 10)

  // 최신 순으로 정렬
  const sortedHealthRecords = [...healthRecords].reverse()

  // 차트 데이터 변환
  const chartData = sortedHealthRecords.map(record => ({
    date: new Date(record.recordedAt).toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    수축기혈압: record.bloodPressure.systolic,
    이완기혈압: record.bloodPressure.diastolic,
    혈당: record.bloodSugar,
    체온: record.temperature
  }))

  const timelineData = sortedHealthRecords.map(record => ({
    children: (
      <div>
        <div className="font-medium">
          {new Date(record.recordedAt).toLocaleString('ko-KR')}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          혈압: {record.bloodPressure.systolic}/{record.bloodPressure.diastolic} mmHg | 
          혈당: {record.bloodSugar} mg/dL | 
          체온: {record.temperature}°C
        </div>
        {record.notes && (
          <div className="text-sm text-blue-600 mt-1">
            💬 {record.notes}
          </div>
        )}
      </div>
    )
  }))

  const tabItems = [
    {
      key: '1',
      label: '혈압 추이',
      children: (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="수축기혈압" 
              stroke="#8884d8" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="이완기혈압" 
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      key: '2',
      label: '혈당 추이',
      children: (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="혈당" 
              stroke="#ffc658" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      key: '3',
      label: '체온 추이',
      children: (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[36, 38]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="체온" 
              stroke="#ff7300" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }
  ]

  // 로딩 상태
  if (patientLoading || recordsLoading) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">환자 정보를 불러오는 중...</p>
        </div>
      </AppLayout>
    )
  }

  // 에러 상태
  if (patientError || recordsError) {
    return (
      <AppLayout>
        <Alert
          message="데이터 로딩 실패"
          description="환자 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
          type="error"
          showIcon
        />
      </AppLayout>
    )
  }

  // 환자 정보가 없는 경우
  if (!patient) {
    return (
      <AppLayout>
        <Alert
          message="환자를 찾을 수 없습니다"
          description="요청하신 환자 정보를 찾을 수 없습니다."
          type="warning"
          showIcon
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 환자 기본 정보 헤더 */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.name}
                </h1>
                <p className="text-gray-600">
                  {patient.age}세 · {patient.gender === 'male' ? '남성' : '여성'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary">
                상담 예약
              </Button>
              <Button variant="secondary">
                화상 상담
              </Button>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {/* 환자 상세 정보 */}
          <Col xs={24} lg={8}>
            <Card title="환자 정보" className="h-full">
              <Descriptions column={1} size="small">
                <Descriptions.Item 
                  label={<><PhoneOutlined className="mr-2" />연락처</>}
                >
                  {patient.phoneNumber}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<><HomeOutlined className="mr-2" />주소</>}
                >
                  {patient.address}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<><CalendarOutlined className="mr-2" />등록일</>}
                >
                  {new Date(patient.createdAt).toLocaleDateString('ko-KR')}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<><CalendarOutlined className="mr-2" />최근 업데이트</>}
                >
                  {new Date(patient.updatedAt).toLocaleDateString('ko-KR')}
                </Descriptions.Item>
              </Descriptions>

              <div className="mt-6">
                <h4 className="font-medium mb-3">최근 건강 상태</h4>
                {sortedHealthRecords.length > 0 && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>혈압:</span>
                      <span className="font-medium">
                        {sortedHealthRecords[0].bloodPressure.systolic}/
                        {sortedHealthRecords[0].bloodPressure.diastolic} mmHg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>혈당:</span>
                      <span className="font-medium">
                        {sortedHealthRecords[0].bloodSugar} mg/dL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>체온:</span>
                      <span className="font-medium">
                        {sortedHealthRecords[0].temperature}°C
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* 건강 데이터 차트 */}
          <Col xs={24} lg={16}>
            <Card title="건강 데이터 추이" className="h-full">
              <Tabs items={tabItems} />
            </Card>
          </Col>
        </Row>

        {/* 기록 타임라인 */}
        <Card title="건강 기록 히스토리">
          <Timeline items={timelineData} />
        </Card>
      </div>
    </AppLayout>
  )
} 