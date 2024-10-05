import {useEffect, useState} from 'react';
import {Typography, Avatar, Box, Container, Paper, Button, CircularProgress} from '@mui/material';
import axios from 'axios';
import {getStoredToken} from 'services/auth';
import {logout} from 'store/slices/authSlice';
import {useNavigate} from 'react-router-dom';
import type {UserInfo} from "src/types/UserInfo.ts";
import {useAppDispatch, useAppSelector} from "hooks/reduxHooks.ts";
import {toast} from "react-toastify";

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;

const User = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isAuthenticated} = useAppSelector(state => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            setLoading(true);
            const token = getStoredToken();
            try {
                const response = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(response.data);
            } catch (error: any) {
                toast.error('Failed to fetch user info');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserInfo();
        } else {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (!userInfo) {
        return (
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{mt: 4, p: 4}}>
                    <Typography variant="h5" gutterBottom>
                        User Profile
                    </Typography>
                    <Typography variant="body1">
                        No user information found
                    </Typography>
                </Paper>
            </Container>
        );

    }


    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{mt: 4, p: 4}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar src={userInfo.picture} alt={userInfo.name} sx={{width: 100, height: 100, mb: 2}}/>
                    <Typography component="h1" variant="h5">
                        User Profile
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2}}>
                        Name: {userInfo.nickname}
                    </Typography>
                    <Typography variant="body1">
                        Email: {userInfo.email}
                    </Typography>
                    <Typography variant="body1">
                        Email Verified: {userInfo.email_verified ? 'Yes' : 'No'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleLogout}
                        sx={{mt: 3}}
                    >
                        logout
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default User;