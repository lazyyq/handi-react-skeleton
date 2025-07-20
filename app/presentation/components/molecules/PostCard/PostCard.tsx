import { Card, Typography } from 'antd';
import { Link } from 'react-router';
import type { Post } from '../../../../domain/entities/Post';

const { Title, Paragraph } = Typography;

export interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      actions={[
        <Link key="view" to={`/posts/${post.id}`}>
          자세히 보기
        </Link>
      ]}
    >
      <Card.Meta
        title={<Title level={4}>{post.title}</Title>}
        description={
          <Paragraph
            ellipsis={{ rows: 3, expandable: false }}
            style={{ margin: 0 }}
          >
            {post.content}
          </Paragraph>
        }
      />
      <div style={{ marginTop: 12, fontSize: '12px', color: '#666' }}>
        작성자 ID: {post.authorId}
      </div>
    </Card>
  );
}; 