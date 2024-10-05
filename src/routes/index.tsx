import {Route, Routes} from "react-router-dom";
import Login from "pages/login";
import User from "pages/user";
import ProtectedRoute from "components/common/ProtectedRoute";
import PublicRoute from "components/common/PublicRoute";
import Admin from "pages/admin";
import Unauthorized from "pages/unauthorized";
import Dashboard from "pages/dashboard";
import NotFound from "src/pages/notFound";

// AppRoutes component defines the routing structure of the application
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public route for the login page */}
            {/* PublicRoute ensures that authenticated users can't access this route */}
            <Route path="/login" element={
                <PublicRoute>
                    <Login/>
                </PublicRoute>
            }/>
            {/* Protected route for the dashboard (home page) */}
            {/* ProtectedRoute ensures that only authenticated users can access this route */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard/>
                </ProtectedRoute>
            }/>
            {/* Protected route for the user page */}
            <Route path="/user" element={
                <ProtectedRoute>
                    <User/>
                </ProtectedRoute>
            }/>
            {/* Protected route for the admin page */}
            {/* This route requires the user to have the 'admin' role */}
            <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                    <Admin/>
                </ProtectedRoute>
            }/>
            {/* Route for the unauthorized page */}
            {/* This page is shown when a user tries to access a page they don't have permission for */}
            <Route path="/unauthorized" element={<Unauthorized/>}/>

             {/* 404 Not Found route */}
            {/* This should be the last route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;