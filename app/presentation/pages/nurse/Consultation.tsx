import { useState } from 'react'
import { Row, Col, Calendar, TimePicker, Button as AntButton, Table, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { AppLayout } from '../../components/templates/AppLayout'
import { Card } from '../../components/atoms'
import type { ConsultationSchedule } from '../../../features/patient/domain/Patient'

// 목업 스케줄 데이터
const mockSchedules: ConsultationSchedule[] = [
  {
    id: '1',
    nurseId: 'nurse-user-1',
    date: new Date(),
    timeSlot: '09:00-09:30',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    nurseId: 'nurse-user-1',
    date: new Date(),
    timeSlot: '10:00-10:30',
    isAvailable: false,
    patientId: '1',
    notes: '김환자 정기 상담',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    nurseId: 'nurse-user-1',
    date: new Date(),
    timeSlot: '14:00-14:30',
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const timeSlots = [
  '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
  '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
  '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
]

export default function Consultation() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [schedules, setSchedules] = useState<ConsultationSchedule[]>(mockSchedules)

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date)
  }

  const toggleTimeSlot = (timeSlot: string) => {
    const dateString = selectedDate.format('YYYY-MM-DD')
    const existingSchedule = schedules.find(
      s => dayjs(s.date).format('YYYY-MM-DD') === dateString && s.timeSlot === timeSlot
    )

    if (existingSchedule) {
      if (existingSchedule.patientId) {
        message.warning('이미 예약된 시간입니다.')
        return
      }
      // 기존 스케줄 토글
      setSchedules(prev => prev.filter(s => s.id !== existingSchedule.id))
      message.success('상담 시간이 해제되었습니다.')
    } else {
      // 새 스케줄 추가
      const newSchedule: ConsultationSchedule = {
        id: Date.now().toString(),
        nurseId: 'nurse-user-1',
        date: selectedDate.toDate(),
        timeSlot,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setSchedules(prev => [...prev, newSchedule])
      message.success('상담 가능 시간이 추가되었습니다.')
    }
  }

  const getScheduleForDate = (date: Dayjs) => {
    const dateString = date.format('YYYY-MM-DD')
    return schedules.filter(s => dayjs(s.date).format('YYYY-MM-DD') === dateString)
  }

  const selectedDateSchedules = getScheduleForDate(selectedDate)

  const dateCellRender = (value: Dayjs) => {
    const daySchedules = getScheduleForDate(value)
    if (daySchedules.length === 0) return null

    return (
      <div className="events">
        {daySchedules.slice(0, 2).map((schedule) => (
          <div key={schedule.id} className="text-xs">
            <Tag 
              color={schedule.isAvailable ? 'green' : 'blue'} 
              className="text-xs"
            >
              {schedule.timeSlot}
            </Tag>
          </div>
        ))}
        {daySchedules.length > 2 && (
          <div className="text-xs text-gray-500">
            +{daySchedules.length - 2}개 더
          </div>
        )}
      </div>
    )
  }

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current)
    return info.originNode
  }

  const upcomingAppointments = schedules
    .filter(s => !s.isAvailable && s.patientId)
    .map(s => ({
      key: s.id,
      date: dayjs(s.date).format('MM/DD'),
      time: s.timeSlot,
      patient: s.notes?.replace(' 정기 상담', '') || '환자',
      status: '예정',
      notes: s.notes
    }))

  const appointmentColumns = [
    {
      title: '날짜',
      dataIndex: 'date',
      key: 'date'
    },
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
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="processing">{status}</Tag>
      )
    },
    {
      title: '메모',
      dataIndex: 'notes',
      key: 'notes'
    }
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">상담 관리</h1>
            <p className="text-gray-600 mt-1">
              상담 가능한 시간을 설정하고 예약을 관리하세요
            </p>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {/* 캘린더 */}
          <Col xs={24} lg={16}>
            <Card title="상담 일정 캘린더">
              <Calendar
                cellRender={cellRender}
                onSelect={handleDateSelect}
                value={selectedDate}
              />
            </Card>
          </Col>

          {/* 선택된 날짜의 시간 슬롯 */}
          <Col xs={24} lg={8}>
            <Card 
              title={`${selectedDate.format('MM월 DD일')} 시간 설정`}
              className="h-full"
            >
              <div className="space-y-2">
                {timeSlots.map(timeSlot => {
                  const existingSchedule = selectedDateSchedules.find(s => s.timeSlot === timeSlot)
                  const isBooked = existingSchedule && !existingSchedule.isAvailable
                  const isAvailable = existingSchedule && existingSchedule.isAvailable

                  return (
                    <div key={timeSlot} className="flex items-center justify-between">
                      <span className="text-sm">{timeSlot}</span>
                      <div className="flex items-center gap-2">
                        {isBooked ? (
                          <Tag color="blue">예약됨</Tag>
                        ) : isAvailable ? (
                          <Tag color="green">상담가능</Tag>
                        ) : (
                          <Tag color="default">미설정</Tag>
                        )}
                        {!isBooked && (
                          <AntButton
                            size="small"
                            type={isAvailable ? "default" : "primary"}
                            icon={isAvailable ? <DeleteOutlined /> : <PlusOutlined />}
                            onClick={() => toggleTimeSlot(timeSlot)}
                          >
                            {isAvailable ? '해제' : '추가'}
                          </AntButton>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 예정된 상담 목록 */}
        <Card title="예정된 상담 목록">
          <Table
            columns={appointmentColumns}
            dataSource={upcomingAppointments}
            pagination={false}
            locale={{ emptyText: '예정된 상담이 없습니다.' }}
          />
        </Card>
      </div>
    </AppLayout>
  )
} 