import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Layers, BarChart2, QrCode, Settings, LogOut, Edit } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/students', label: 'Students', icon: Users },
        { path: '/courses', label: 'Courses Catalog', icon: BookOpen },
        { path: '/courses-admin', label: 'Courses Admin', icon: Edit },
        { path: '/batches', label: 'Batches View', icon: Layers },
        { path: '/batches-admin', label: 'Batches Admin', icon: Edit },
        { path: '/reports', label: 'Reports Hub', icon: BarChart2 },
        { path: '/qr-management', label: 'QR Manager', icon: QrCode },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 bg-[#111C44] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-white font-bold text-xl">TZ</span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-wide">TechZone</h1>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Academy</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/5">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
