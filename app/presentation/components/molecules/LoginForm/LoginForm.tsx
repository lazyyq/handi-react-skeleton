import { Form, Card, Space, Input } from 'antd';
import { Button } from '../../atoms/Button/Button';
import { useLogin } from '../../../hooks/useAuth';

interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();

  const handleSubmit = async (values: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(values);
      onSuccess?.();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card title="로그인" style={{ maxWidth: 400, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loginMutation.isPending}
      >
        <Form.Item
          label="사용자명"
          name="username"
          rules={[{ required: true, message: '사용자명을 입력해주세요!' }]}
        >
          <Input placeholder="사용자명을 입력하세요" />
        </Form.Item>

        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
        >
          <Input.Password placeholder="비밀번호를 입력하세요" />
        </Form.Item>

        <Form.Item>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginMutation.isPending}
              style={{ width: '100%' }}
            >
              로그인
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}; 