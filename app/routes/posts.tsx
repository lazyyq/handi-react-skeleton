import { Typography } from 'antd';
import { PostList } from '../presentation/components/organisms/PostList/PostList';

const { Title, Paragraph } = Typography;

export default function Posts() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>게시글 목록</Title>
        <Paragraph>
          JSONPlaceholder API에서 제공하는 샘플 게시글들입니다. 
          각 게시글을 클릭하면 상세 내용을 볼 수 있습니다.
        </Paragraph>
      </div>
      
      <PostList />
    </div>
  );
} 