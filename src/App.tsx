import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "components/navbar";
import AppRoutes from "src/routes";
import { store } from "src/store";
import { Provider } from 'react-redux';
import { MarvelProvider } from "src/contexts/MarvelContext";
import ErrorBoundary from './components/common/ErrorBoundary';

const theme = createTheme();

function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <MarvelProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ToastContainer />
                        <Navbar />
                        <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
                            <AppRoutes />
                        </Container>
                    </ThemeProvider>
                </MarvelProvider>
            </Provider>
        </ErrorBoundary>
    );
}

export default App;