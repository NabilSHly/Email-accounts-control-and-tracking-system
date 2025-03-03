import React from 'react';
import { Button } from '@/components/ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">عذراً، حدث خطأ ما</h2>
          <p className="text-gray-600 mb-4">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            إعادة تحميل الصفحة
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
} 