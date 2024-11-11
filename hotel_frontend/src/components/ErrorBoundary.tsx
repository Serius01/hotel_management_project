// src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional custom fallback UI
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('Uncaught error:', error, errorInfo);

    // Send the error to Sentry with the component stack
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack, // Pass component stack as extra info
      },
    });
  }

  handleReload = () => {
    // Reset error state and reload the page
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise a default message
      return (
        <div>
          {this.props.fallback || <h1>Что-то пошло не так.</h1>}
          <button onClick={this.handleReload}>Перезагрузить страницу</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
