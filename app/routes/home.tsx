import { Typography, Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router';
import { useAuthStore } from '../presentation/store/authStore';

const { Title, Paragraph } = Typography;

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1}>Handi에 오신 것을 환영합니다!</Title>
        {isAuthenticated && user ? (
          <Paragraph style={{ fontSize: 18 }}>
            안녕하세요, <strong>{user.displayName}</strong>님!
          </Paragraph>
        ) : (
          <Paragraph style={{ fontSize: 18 }}>
            로그인하여 더 많은 기능을 이용해보세요.
          </Paragraph>
        )}
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            title="게시글 보기"
            extra={<Link to="/posts">전체 보기</Link>}
            hoverable
          >
            <Paragraph>
              다양한 주제의 게시글들을 확인해보세요. 
              JSONPlaceholder API를 통해 샘플 데이터를 제공합니다.
            </Paragraph>
            <Button type="primary" block>
              <Link to="/posts">게시글 목록</Link>
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="사용자 인증"
            hoverable
          >
            <Paragraph>
              {isAuthenticated ? (
                '로그인 상태입니다. 헤더에서 사용자 정보를 확인할 수 있습니다.'
              ) : (
                '간편한 로그인 시스템을 체험해보세요. 테스트용으로 모든 로그인이 성공합니다.'
              )}
            </Paragraph>
            {!isAuthenticated && (
              <Button type="primary" block>
                <Link to="/login">로그인하기</Link>
              </Button>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title="기술 스택"
            hoverable
          >
            <Paragraph>
              이 프로젝트는 React, TypeScript, Ant Design, 
              React Query, Zustand를 사용하여 구축되었습니다.
            </Paragraph>
            <ul style={{ paddingLeft: 20 }}>
              <li>Clean Architecture</li>
              <li>Atomic Design Pattern</li>
              <li>React Router v7</li>
              <li>Vite</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
