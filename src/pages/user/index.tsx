import {useEffect} from 'react';
import {Avatar, Box, Button, CircularProgress, Container, Paper, Typography} from '@mui/material';
import axios from 'axios';
import {getStoredToken} from 'services/auth';
import {logout} from 'store/slices/authSlice';
import {useNavigate} from 'react-router-dom';
import {UserInfo} from "src/types/UserInfo.ts";
import {useAppDispatch, useAppSelector} from "hooks/reduxHooks.ts";
import {toast} from "react-toastify";
import {clearUserInfo, setError, setLoading, setUserInfo} from 'store/slices/userSlice';
import LogViewer from "components/common/LogViewer.tsx";
import Grid from '@mui/material/Grid2';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN; // Auth0 domain from environment variables.

const User = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {isAuthenticated} = useAppSelector(state => state.auth);
    const {info: userInfo, loading, error} = useAppSelector(state => state.user);

    // useEffect to fetch user information once the component mounts.
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            // If user info already exists, don't fetch again.
            if (userInfo) return;

            dispatch(setLoading(true)); // Set loading state to true while fetching data.
            const token = getStoredToken(); // Retrieve the token from storage.
            try {
                const response = await axios.get<UserInfo>(`https://${AUTH0_DOMAIN}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Set authorization header with the token.
                    }
                });
                dispatch(setUserInfo(response.data)); // Store fetched user info in the Redux store.
            } catch (error: any) {
                dispatch(setError('Failed to fetch user info')); // Set error state in case of failure.
                toast.error('Failed to fetch user info'); // Show error notification.
                navigate('/login');  // Redirect to login page if fetching user info fails.
            }
        };

        fetchUserInfo();
    }, [isAuthenticated, navigate, dispatch, userInfo]); // Dependency array to run when authentication status or user info changes.


    // Logout handler to clear authentication and user info, then redirect to login.
    const handleLogout = () => {
        dispatch(logout()); // Dispatch logout action.
        dispatch(clearUserInfo()); // Clear user information from the Redux store.
        navigate('/login');
    };

    // Render a loading spinner while user info is being fetched.
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    // Render an error message if there was an error fetching user info or if user info is missing.
    if (error || !userInfo) {
        return (
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{mt: 4, p: 4}}>
                    <Typography variant="h5" gutterBottom>
                        User Profile
                    </Typography>
                    <Typography variant="body1">
                        {error || 'No user information found'}
                    </Typography>
                </Paper>
            </Container>
        );
    }


    // Render the user profile and log viewer once user info has been successfully fetched.
    return (
        <Container component="main" maxWidth="lg">
            <Grid container spacing={3} sx={{mt: 2}}>
                <Grid size={{xs: 12, md: 6}}>
                    <Paper elevation={3} sx={{p: 4, height: 'auto'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
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
                                sx={{mt: 'auto'}}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                    <Paper elevation={3} sx={{p: 4}}>
                        <LogViewer/>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default User;