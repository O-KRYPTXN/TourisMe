import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DashboardRedirect = () => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Map roles to dashboard routes
    const dashboardMap = {
        Admin: '/dashboard/admin',
        Tourist: '/dashboard/tourist',
        LocalBusinessOwner: '/dashboard/provider',
    };

    const dashboardRoute = dashboardMap[user?.role] || '/';
    return <Navigate to={dashboardRoute} replace />;
};

export default DashboardRedirect;
