import { Layout, Menu, Button, Space, Typography } from 'antd';
import { Link, useNavigate } from 'react-router';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../../store/authStore';
import { useLogout } from '../../../hooks/useAuth';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">홈</Link>,
    },
    {
      key: 'posts',
      label: <Link to="/posts">게시글</Link>,
    },
  ];

  return (
    <AntHeader style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: 50 }}>
          <Link to="/" style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
            Handi
          </Link>
        </div>
        <Menu
          mode="horizontal"
          items={menuItems}
          style={{ border: 'none', flex: 1 }}
        />
      </div>

      <div>
        {isAuthenticated && user ? (
          <Space>
            <UserOutlined />
            <Text>{user.displayName}</Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={logoutMutation.isPending}
            >
              로그아웃
            </Button>
          </Space>
        ) : (
          <Button type="primary">
            <Link to="/login">로그인</Link>
          </Button>
        )}
      </div>
    </AntHeader>
  );
}; 