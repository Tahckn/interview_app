import {AppBar, Button, Toolbar, Typography} from "@mui/material";
import {NavLink, redirect} from "react-router-dom";
import {useAppSelector, useAppDispatch} from 'hooks/reduxHooks.ts';
import {logout} from 'src/store/slices/authSlice';

const Navbar = () => {
    const {isAuthenticated} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        redirect('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <NavLink to="/" style={{textDecoration: 'none', color: 'white'}}>
                        Interview App
                    </NavLink>
                </Typography>
                <Button color="inherit" component={NavLink} to="/">
                    Dashboard
                </Button>
                {!isAuthenticated ? (
                    <Button color="inherit" component={NavLink} to="/login">
                        Login
                    </Button>
                ) : (
                    <>
                        <Button color="inherit" component={NavLink} to="/user">
                            User / logs
                        </Button>
                        <Button color="inherit" component={NavLink} to="/admin">
                            Admin
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar;