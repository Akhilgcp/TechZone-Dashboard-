import React, { useState } from 'react';
import { User, Bell, Moon, Shield, LogOut, ChevronRight, Save } from 'lucide-react';
import '../Dashboard.css';

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const handleSave = () => {
        alert("Settings saved! (This is a demo action)");
    };

    const Toggle = ({ checked }) => (
        <div className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'left-7' : 'left-1'}`} />
        </div>
    );

    const Section = ({ title, icon: Icon, children }) => (
        <div className="bg-[#111C44]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
                <p className="text-gray-400 text-sm">Manage your preferences and account</p>
            </div>

            {/* Profile Section */}
            <Section title="Profile Information" icon={User}>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-4 border-[#111C44]"
                        />
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-[#111C44]">
                            <User size={14} />
                        </button>
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Admin User"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Email Address</label>
                            <input
                                type="email"
                                defaultValue="admin@techzone.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Preferences Section */}
            <Section title="App Preferences" icon={Shield}>
                <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setNotifications(!notifications)}
                >
                    <div className="flex items-center gap-3">
                        <Bell size={20} className="text-gray-400" />
                        <div>
                            <h4 className="text-white font-medium">Email Notifications</h4>
                            <p className="text-gray-400 text-xs">Receive updates about batch performance</p>
                        </div>
                    </div>
                    <Toggle checked={notifications} />
                </div>

                <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    <div className="flex items-center gap-3">
                        <Moon size={20} className="text-gray-400" />
                        <div>
                            <h4 className="text-white font-medium">Dark Mode</h4>
                            <p className="text-gray-400 text-xs">Use dark theme across the dashboard</p>
                        </div>
                    </div>
                    <Toggle checked={darkMode} />
                </div>

                <div
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setAutoSave(!autoSave)}
                >
                    <div className="flex items-center gap-3">
                        <Save size={20} className="text-gray-400" />
                        <div>
                            <h4 className="text-white font-medium">Auto-Save Reports</h4>
                            <p className="text-gray-400 text-xs">Automatically save changes to reports</p>
                        </div>
                    </div>
                    <Toggle checked={autoSave} />
                </div>
            </Section>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                    <LogOut size={18} />
                    Sign Out
                </button>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
