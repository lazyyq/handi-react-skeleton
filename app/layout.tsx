import { Outlet } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { MainLayout } from './presentation/components/templates/MainLayout/MainLayout';
import { ErrorBoundary } from './presentation/components/atoms/ErrorBoundary/ErrorBoundary';
import { ServicesProvider } from './presentation/contexts/ServicesContext';
import './app.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation 에러:', error);
      },
    },
  },
});

export default function Layout() {
  return (
    <ErrorBoundary>
      <ServicesProvider>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider locale={koKR}>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </ConfigProvider>
          <ReactQueryDevtools 
            initialIsOpen={false} 
            buttonPosition="bottom-left"
          />
        </QueryClientProvider>
      </ServicesProvider>
    </ErrorBoundary>
  );
} 