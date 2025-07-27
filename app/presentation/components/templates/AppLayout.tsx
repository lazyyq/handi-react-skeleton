import { Layout } from 'antd'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { useAuthStore } from '../../stores/authStore'

const { Content } = Layout

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        {isAuthenticated && <Sidebar />}
        <Layout className="bg-gray-50">
          <Content className={`${isAuthenticated ? 'p-6' : 'p-0'}`}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout 