import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, BarChart2, Settings, LogOut, QrCode } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">TZ</div>
                <span className="logo-text">TechZone <span className="logo-highlight">Academy</span></span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Students</span>
                </NavLink>
                <NavLink to="/courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BookOpen size={20} />
                    <span>Courses</span>
                </NavLink>
                <NavLink to="/batches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={20} />
                    <span>Batches</span>
                </NavLink>
                <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart2 size={20} />
                    <span>Reports</span>
                </NavLink>
                <NavLink to="/qr-management" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <QrCode size={20} />
                    <span>QR Manager</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <a href="#" className="nav-item logout">
                    <LogOut size={20} />
                    <span>Logout</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
