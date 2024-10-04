import React, {useState} from 'react';
import {TextField, Button, Typography, Box, Container} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {getToken, getRolesFromToken, setToken} from 'services/auth';
import {useAppDispatch} from 'hooks/reduxHooks';
import {login} from 'store/slices/authSlice';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getToken(username, password);
            setToken(token);
            const roles = getRolesFromToken(token);
            dispatch(login({ roles }));
            navigate('/');
        } catch (error) {
            console.error('Giriş başarısız:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Giriş Yap
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Kullanıcı Adı"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Şifre"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Giriş Yap
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;