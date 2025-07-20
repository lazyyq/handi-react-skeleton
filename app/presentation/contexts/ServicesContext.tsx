import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

// Domain Interfaces
import type { AuthRepository } from '../../domain/repositories/AuthRepository';
import type { PostRepository } from '../../domain/repositories/PostRepository';
import type { AuthUseCase } from '../../domain/use-cases/auth';
import type { PostsUseCase } from '../../domain/use-cases/posts';

// Domain Implementations
import { AuthUseCaseImpl } from '../../domain/use-cases/auth';
import { PostsUseCaseImpl } from '../../domain/use-cases/posts';

// Infrastructure Implementations
import { ApiAuthRepository } from '../../infrastructure/repositories/ApiAuthRepository';
import { ApiPostRepository } from '../../infrastructure/repositories/ApiPostRepository';

// Application Services
import { AuthService } from '../../application/services/AuthService';
import { PostService } from '../../application/services/PostService';

// 서비스 타입 정의
export interface Services {
  authService: AuthService;
  postService: PostService;
  // UseCase 직접 접근도 가능
  authUseCase: AuthUseCase;
  postsUseCase: PostsUseCase;
}

// Context 생성
const ServicesContext = createContext<Services | null>(null);

// Custom Hook for consuming services
export const useServices = (): Services => {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return services;
};

// 개별 서비스 접근을 위한 편의 훅들
export const useAuthService = (): AuthService => {
  return useServices().authService;
};

export const usePostService = (): PostService => {
  return useServices().postService;
};

// Provider Props
interface ServicesProviderProps {
  children: ReactNode;
  // 테스트를 위한 의존성 주입 (선택적)
  authRepository?: AuthRepository;
  postRepository?: PostRepository;
}

// Provider 컴포넌트
export const ServicesProvider: React.FC<ServicesProviderProps> = ({
  children,
  authRepository,
  postRepository,
}) => {
  const services = useMemo(() => {
    // Repository 인스턴스 생성 (테스트용 주입이 있으면 사용)
    const authRepo = authRepository || new ApiAuthRepository();
    const postRepo = postRepository || new ApiPostRepository();

    // Use Case 인스턴스 생성
    const authUseCase = new AuthUseCaseImpl(authRepo);
    const postsUseCase = new PostsUseCaseImpl(postRepo);

    // Application Service 인스턴스 생성
    const authService = new AuthService(authUseCase);
    const postService = new PostService(postsUseCase);

    return {
      authService,
      postService,
      authUseCase,
      postsUseCase,
    };
  }, [authRepository, postRepository]);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

// HOC 패턴도 제공 (선택적)
export const withServices = <P extends object>(
  Component: React.ComponentType<P & { services: Services }>
) => {
  return (props: P) => {
    const services = useServices();
    return <Component {...props} services={services} />;
  };
}; 