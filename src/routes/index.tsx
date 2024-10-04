import {Route, Routes} from "react-router-dom";
import Login from "pages/login";
import Home from "pages/home";
import User from "pages/user";
import ProtectedRoute from "components/common/ProtectedRoute";
import PublicRoute from "components/common/PublicRoute";
import Admin from "pages/admin";
import Unauthorized from "pages/unauthorized";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login/>
                </PublicRoute>
            }/>
            <Route path="/" element={
                <ProtectedRoute>
                    <Home/>
                </ProtectedRoute>
            }/>
            <Route path="/user" element={
                <ProtectedRoute>
                    <User/>
                </ProtectedRoute>
            }/>
            <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                    <Admin/>
                </ProtectedRoute>
            }/>
            <Route path="/unauthorized" element={<Unauthorized/>}/>
        </Routes>
    );
};

export default AppRoutes;