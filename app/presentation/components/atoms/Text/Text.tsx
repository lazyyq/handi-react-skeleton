import { Typography } from 'antd';
import type { TextProps as AntTextProps } from 'antd/es/typography/Text';

const { Text: AntText } = Typography;

export interface TextProps extends AntTextProps {
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return <AntText {...props}>{children}</AntText>;
}; 