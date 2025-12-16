import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Bir Hata Oluştu</h1>
                    <div className="bg-slate-900 p-6 rounded-xl border border-red-500/20 max-w-2xl w-full overflow-auto">
                        <p className="font-mono text-sm text-red-300 mb-4">
                            {this.state.error && this.state.error.toString()}
                        </p>
                        <pre className="font-mono text-xs text-slate-500 whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
