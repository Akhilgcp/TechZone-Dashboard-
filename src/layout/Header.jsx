import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Info, X, CheckCircle, AlertTriangle } from 'lucide-react';
import './Layout.css';

const Header = () => {
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const notifRef = useRef(null);
    const infoRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (infoRef.current && !infoRef.current.contains(event.target)) {
                setShowInfo(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Main Dashboard';
            case '/students': return 'Students Management';
            case '/courses': return 'Courses Management';
            case '/batches': return 'Batches Management';
            case '/reports': return 'Reports & Analytics';
            case '/settings': return 'Settings';
            default: return 'Dashboard';
        }
    };

    const getBreadcrumb = (pathname) => {
        const title = getPageTitle(pathname);
        return title.replace(' Management', '').replace(' & Analytics', '');
    };

    const notifications = [
        { id: 1, type: 'success', text: 'Batch B001 attendance report generated', time: '2 min ago' },
        { id: 2, type: 'warning', text: '3 Students marked absent for > 3 days', time: '1 hour ago' },
        { id: 3, type: 'info', text: 'New course "React Advanced" added', time: '5 hours ago' }
    ];

    return (
        <header className="header">
            <div className="header-left">
                <div className="breadcrumb">
                    <span className="breadcrumb-main">Pages</span> / <span className="breadcrumb-current">{getBreadcrumb(location.pathname)}</span>
                </div>
                <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
            </div>

            <div className="header-right">
                <div className="search-bar">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Global Search..." />
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        className={`icon-btn ${showNotifications ? 'bg-white/10 text-white' : ''}`}
                        onClick={() => { setShowNotifications(!showNotifications); setShowInfo(false); }}
                    >
                        <Bell size={20} />
                        <span className="notification-badge"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-80 bg-[#111C44] border border-white/10 rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-white font-bold">Notifications</h3>
                                <span className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">Mark all read</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                                        <div className={`mt-1 ${notif.type === 'success' ? 'text-green-400' : notif.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                            {notif.type === 'success' ? <CheckCircle size={16} /> : notif.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-200 leading-snug">{notif.text}</p>
                                            <span className="text-xs text-gray-500 mt-1 block">{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center border-t border-white/10">
                                <button className="text-xs text-gray-400 hover:text-white">View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Dropdown */}
                <div className="relative" ref={infoRef}>
                    <button
                        className={`icon-btn ${showInfo ? 'bg-white/10 text-white' : ''}`}
                        onClick={() => { setShowInfo(!showInfo); setShowNotifications(false); }}
                    >
                        <Info size={20} />
                    </button>

                    {showInfo && (
                        <div className="absolute right-0 top-12 w-72 bg-[#111C44] border border-white/10 rounded-2xl shadow-2xl z-50 animate-fade-in p-5">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-white font-bold text-lg">TechZone Dashboard</h3>
                                <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                Version 2.4.0 (Stable)
                                <br />
                                Last Updated: Nov 28, 2025
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Server Status</span>
                                    <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Database</span>
                                    <span className="text-green-400">Connected</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">License</span>
                                    <span className="text-white">Pro Enterprise</span>
                                </div>
                            </div>
                            <button className="w-full mt-5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 rounded-xl text-sm font-medium transition-colors">
                                View Documentation
                            </button>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=1A73E8&color=fff" alt="Profile" />
                </div>
            </div>
        </header>
    );
};

export default Header;
