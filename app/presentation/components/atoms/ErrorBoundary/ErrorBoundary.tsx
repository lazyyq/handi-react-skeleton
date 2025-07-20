import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert, Button } from 'antd';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Alert
            message="앱에서 오류가 발생했습니다"
            description={
              <div>
                <p>페이지를 새로고침하거나 다시 시도해주세요.</p>
                {this.state.error && (
                  <details style={{ marginTop: '10px', textAlign: 'left' }}>
                    <summary>오류 세부사항</summary>
                    <pre style={{ 
                      fontSize: '12px', 
                      background: '#f5f5f5', 
                      padding: '10px', 
                      borderRadius: '4px',
                      overflow: 'auto'
                    }}>
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
              </div>
            }
            type="error"
            showIcon
            action={
              <Button size="small" onClick={this.handleReset}>
                다시 시도
              </Button>
            }
            style={{ maxWidth: 600, margin: '0 auto' }}
          />
        </div>
      );
    }

    return this.props.children;
  }
} 