import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user's role is in the allowed roles
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to their correct dashboard based on their role
        const dashboardMap = {
            Admin: '/dashboard/admin',
            Tourist: '/dashboard/tourist',
            LocalBusinessOwner: '/dashboard/provider',
        };

        const userDashboard = dashboardMap[user?.role] || '/';
        return <Navigate to={userDashboard} replace />;
    }

    return children;
};

export default RoleBasedRoute;
