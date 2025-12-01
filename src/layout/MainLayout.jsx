import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('tz_token');
        // Allow public access to QR registration/attendance if needed, 
        // but for now, let's assume everything under MainLayout is protected.
        // If we want public routes, they should be outside MainLayout or handled here.
        // For this demo, we protect everything.
        if (!token) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [navigate, location]);

    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
