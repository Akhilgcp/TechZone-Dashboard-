import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="text-white border border-red-500 p-4">
            Main Layout Active
            <Outlet />
        </div>
    );
};

export default MainLayout;
