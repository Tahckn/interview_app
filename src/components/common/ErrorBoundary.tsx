
import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography, Button, Box } from '@mui/material';
import logger from 'services/logger';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true, error: null, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('Uncaught error', { error: error.toString(), errorInfo: errorInfo.componentStack });
        this.setState({ error, errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                    padding={3}
                    textAlign="center"
                >
                    <Typography variant="h4" gutterBottom>
                        Oops! Something went wrong.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We are sorry for the inconvenience. Please try refreshing the page.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={this.handleReload}>
                        Refresh Page
                    </Button>
                    {import.meta.env.NODE_ENV === 'development' && this.state.error && (
                        <Box mt={4} textAlign="left">
                            <Typography variant="h6">Error Details:</Typography>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </Box>
                    )}
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;