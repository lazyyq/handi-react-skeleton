import { Layout } from 'antd';
import { Header } from '../../organisms/Header/Header';

const { Content, Footer } = Layout;

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        Handi ©{new Date().getFullYear()} Created with React & Ant Design
      </Footer>
    </Layout>
  );
}; 