import { useState } from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router'
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  SettingOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useAuthStore } from '../../../stores/authStore'
import { UserRole } from '../../../../domain/entities/User'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return null
  }

  const nurseMenuItems: MenuItem[] = [
    {
      key: '/nurse/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/nurse/dashboard">대시보드</Link>
    },
    {
      key: '/nurse/consultation',
      icon: <CalendarOutlined />,
      label: <Link to="/nurse/consultation">상담 관리</Link>
    },
    {
      key: '/nurse/patients',
      icon: <UserOutlined />,
      label: <Link to="/nurse/patients">환자 관리</Link>
    },
    {
      key: '/nurse/video-call',
      icon: <VideoCameraOutlined />,
      label: <Link to="/nurse/video-call">화상 상담</Link>
    }
  ]

  const adminMenuItems: MenuItem[] = [
    {
      key: '/admin/hospital',
      icon: <TeamOutlined />,
      label: <Link to="/admin/hospital">병원 관리</Link>
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">설정</Link>
    }
  ]

  const menuItems = user.role === UserRole.NURSE ? nurseMenuItems : adminMenuItems

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      className="border-r border-gray-200"
      width={256}
    >
      <div className="p-4">
        <div className={`text-center ${collapsed ? 'px-0' : 'px-2'}`}>
          <div className={`font-semibold text-gray-800 ${collapsed ? 'text-xs' : 'text-sm'}`}>
            {user.role === UserRole.NURSE ? '간호사 모드' : '관리자 모드'}
          </div>
          {!collapsed && (
            <div className="text-xs text-gray-500 mt-1">
              {user.name}
            </div>
          )}
        </div>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="border-r-0"
      />
    </Sider>
  )
}

export default Sidebar 