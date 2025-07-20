import { List, Spin, Alert } from 'antd';
import { PostCard } from '../../molecules/PostCard/PostCard';
import { usePosts } from '../../../hooks/usePosts';

export const PostList: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts();

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
      />
    );
  }

  return (
    <List
      dataSource={posts}
      renderItem={(post) => (
        <List.Item key={post.id}>
          <PostCard post={post} />
        </List.Item>
      )}
      style={{ background: '#fff' }}
    />
  );
}; 