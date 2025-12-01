import React, { useState } from 'react';
import { Bell, Search, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderLogout from '../components/HeaderLogout';
import Notifications from '../components/Notifications';

const Header = () => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const user = JSON.parse(localStorage.getItem('tz_user') || '{"name":"Admin","role":"User"}');

    return (
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#111C44]/50 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#0B1437] border-none rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Notifications />
                </div>

                <div className="relative">
                    <div
                        className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-12 w-48 bg-[#111C44] border border-white/10 rounded-xl shadow-2xl py-2 z-50"
                            >
                                <div className="px-4 py-3 border-b border-white/5">
                                    <p className="text-sm text-white font-bold">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email || 'user@techzone.com'}</p>
                                </div>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2">
                                    <User size={16} />
                                    Profile
                                </button>
                                <HeaderLogout />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
