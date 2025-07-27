import { UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons'
import { Card } from '../../../components/atoms'
import type { Patient } from '../../../../features/patient/domain/Patient'

interface PatientCardProps {
  patient: Patient
  onClick?: () => void
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const getGenderText = (gender: string) => {
    return gender === 'male' ? '남성' : '여성'
  }

  return (
    <Card
      hoverable
      onClick={onClick}
      className="cursor-pointer"
      title={
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span className="font-semibold">{patient.name}</span>
          <span className="text-sm text-gray-500">({patient.age}세, {getGenderText(patient.gender)})</span>
        </div>
      }
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <PhoneOutlined className="text-gray-400" />
          <span>{patient.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <HomeOutlined className="text-gray-400" />
          <span>{patient.address}</span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          등록일: {new Date(patient.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </Card>
  )
}

export default PatientCard 