import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';
import { Save, RefreshCw, Moon, Sun, Zap } from 'lucide-react';
import Card from '../components/Card';

const Settings = () => {
    const [apiUrl, setApiUrl] = useState(localStorage.getItem('TECHZONE_API_URL') || API_BASE);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('TECHZONE_THEME') !== 'light');
    const [polling, setPolling] = useState(localStorage.getItem('TECHZONE_POLLING') !== 'false');

    const handleSave = () => {
        localStorage.setItem('TECHZONE_API_URL', apiUrl);
        localStorage.setItem('TECHZONE_THEME', darkMode ? 'dark' : 'light');
        localStorage.setItem('TECHZONE_POLLING', polling);

        alert("Settings saved! The application will reload to apply changes.");
        window.location.reload();
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">System Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" size={20} /> Connectivity
                    </h2>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">API Endpoint URL</label>
                        <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className="w-full bg-[#0B1437] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">Google Apps Script Web App URL</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <span className="text-white block font-medium">Auto-Refresh Data</span>
                            <span className="text-xs text-gray-400">Poll API every 30 seconds</span>
                        </div>
                        <button
                            onClick={() => setPolling(!polling)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${polling ? 'bg-blue-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${polling ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </Card>

                <Card className="space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Moon className="text-purple-400" size={20} /> Appearance
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                            <span className="text-white block font-medium">Dark Mode</span>
                            <span className="text-xs text-gray-400">Toggle application theme</span>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                >
                    <Save size={20} /> Save & Reload
                </button>
            </div>
        </div>
    );
};

export default Settings;
