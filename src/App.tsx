import {Container, CssBaseline, ThemeProvider, createTheme} from '@mui/material';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "components/navbar";
import AppRoutes from "src/routes";
import {store} from "src/store";
import {Provider} from 'react-redux';
import {MarvelProvider} from "src/contexts/MarvelContext";

const theme = createTheme();

function App() {
    return (
        <Provider store={store}>
            <MarvelProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <ToastContainer/>
                    <Navbar/>
                    <Container component="main" maxWidth="md" sx={{mt: 4}}>
                        <AppRoutes/>
                    </Container>
                </ThemeProvider>
            </MarvelProvider>
        </Provider>
    );
}

export default App;