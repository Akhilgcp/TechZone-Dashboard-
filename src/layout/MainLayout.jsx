import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
