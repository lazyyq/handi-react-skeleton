import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Typography, Alert } from 'antd';
import { LoginForm } from '../presentation/components/molecules/LoginForm/LoginForm';
import { useAuthStore } from '../presentation/store/authStore';

const { Title, Paragraph } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    navigate('/');
  };

  if (isAuthenticated) {
    return null; // 이미 로그인된 경우 리다이렉트 처리
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>로그인</Title>
        <Paragraph>
          계정에 로그인하여 Handi의 모든 기능을 이용해보세요.
        </Paragraph>
      </div>

      <Alert
        message="테스트 계정 안내"
        description="이 데모에서는 어떤 사용자명과 비밀번호로도 로그인할 수 있습니다."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
} 