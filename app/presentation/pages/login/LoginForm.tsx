import { useState } from 'react'
import { Form, Select, message, Input as AntInput } from 'antd'
import { Button } from '../../components/atoms'
import { UserRole } from '../../../domain/entities/User'
import type { LoginCredentials } from '../../../domain/entities/User'

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  loading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm()
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.NURSE)

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit({
        email: values.email,
        password: values.password,
        role: selectedRole
      })
    } catch (error) {
      message.error('로그인에 실패했습니다.')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="w-full max-w-md"
    >
      <Form.Item
        label="역할 선택"
        name="role"
        rules={[{ required: true, message: '역할을 선택해주세요' }]}
        initialValue={UserRole.NURSE}
      >
        <Select
          value={selectedRole}
          onChange={setSelectedRole}
          size="large"
        >
          <Select.Option value={UserRole.NURSE}>간호사</Select.Option>
          <Select.Option value={UserRole.ADMIN}>관리자</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="이메일"
        name="email"
        rules={[
          { required: true, message: '이메일을 입력해주세요' },
          { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
        ]}
      >
        <AntInput 
          placeholder="이메일을 입력하세요"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="비밀번호"
        name="password"
        rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
      >
        <AntInput.Password 
          placeholder="비밀번호를 입력하세요"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          className="w-full"
        >
          로그인
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm 