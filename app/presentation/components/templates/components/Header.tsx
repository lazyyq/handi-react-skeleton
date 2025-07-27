import { Layout, Dropdown, Avatar } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button } from '../../atoms'
import { useAuthStore } from '../../../stores/authStore'

const { Header: AntHeader } = Layout

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '로그아웃',
      onClick: handleLogout
    }
  ]

  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600 m-0">
          Handi
        </h1>
        <span className="text-sm text-gray-500 ml-2">환자 관리 서비스</span>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <Avatar icon={<UserOutlined />} size="small" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">
                  {user.role === 'nurse' ? '간호사' : '관리자'}
                </span>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Button variant="primary" href="/login">
            로그인
          </Button>
        )}
      </div>
    </AntHeader>
  )
}

export default Header 