import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useData } from '../context/DataContext'; // adjust path if needed

const HeaderLogout = () => {
    const navigate = useNavigate();
    const { stopPolling } = useData();

    const logout = () => {
        try {
            if (typeof stopPolling === 'function') stopPolling();
            localStorage.removeItem('tz_token');
            localStorage.removeItem('API_BASE');
            navigate('/login', { replace: true });
            toast.success('Logged out successfully');
        } catch (err) {
            console.error('Logout failed', err);
            toast.error('Logout failed. Please refresh the page.');
        }
    };

    return (
        <button
            onClick={logout}
            className="px-4 py-2 rounded bg-transparent hover:bg-white/5 text-sm w-full text-left text-red-400 flex items-center gap-2"
            aria-label="Logout"
        >
            Logout
        </button>
    );
};

export default HeaderLogout;
