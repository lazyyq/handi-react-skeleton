import { useParams, Link } from 'react-router';
import { Card, Typography, Button, Spin, Alert, Space } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { usePost } from '../presentation/hooks/usePosts';

const { Title, Paragraph } = Typography;

export default function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="게시글을 불러오는데 실패했습니다"
        description="잠시 후 다시 시도해주세요."
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
        action={
          <Button size="small" type="primary">
            <Link to="/posts">목록으로 돌아가기</Link>
          </Button>
        }
      />
    );
  }

  if (!post) {
    return (
      <Alert
        message="게시글을 찾을 수 없습니다"
        type="warning"
        showIcon
        action={
          <Button size="small" type="primary">
            <Link to="/posts">목록으로 돌아가기</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Button type="text" icon={<ArrowLeftOutlined />}>
          <Link to="/posts">게시글 목록으로 돌아가기</Link>
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>{post.title}</Title>
          <Space>
            <UserOutlined />
            <span style={{ color: '#666' }}>작성자 ID: {post.authorId}</span>
          </Space>
        </div>

        <div style={{ 
          fontSize: 16, 
          lineHeight: 1.6, 
          whiteSpace: 'pre-wrap',
          marginBottom: 32 
        }}>
          {post.content}
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Button type="primary">
            <Link to="/posts">목록으로 돌아가기</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
} 