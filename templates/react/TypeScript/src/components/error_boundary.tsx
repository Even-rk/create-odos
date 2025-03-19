import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  has_error: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      has_error: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 以在下一次渲染时显示降级 UI
    return { 
      has_error: true,
      error 
    };
  }

  componentDidCatch(error: Error, error_info: ErrorInfo): void {
    // 你也可以将错误记录到错误报告服务
    console.error('Error caught by ErrorBoundary:', error, error_info);
  }

  render(): ReactNode {
    if (this.state.has_error) {
      // 你可以渲染任何自定义的降级 UI
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>出错了！</h2>
          <p>{this.state.error?.message || '发生了未知错误'}</p>
          <button onClick={() => this.setState({ has_error: false, error: null })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 