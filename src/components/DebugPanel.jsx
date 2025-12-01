import React, { useState } from 'react';
import { Activity, RefreshCw, Wifi, WifiOff, Database, ChevronUp, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { POLL_INTERVAL } from '../config';

const DebugPanel = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        loading,
        error,
        lastFetched,
        students,
        attendance_report,
        courses,
        batches,
        // refreshData,
        isOffline
    } = useData();

    if (process.env.NODE_ENV === 'production' && !window.location.hash.includes('debug')) {
        return null; // Hide in production unless #debug is present, or just show it for this demo
    }

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
            <div className="bg-[#111C44] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header / Toggle */}
                <div
                    className="p-3 flex items-center justify-between cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <Activity size={16} className={loading ? "text-yellow-400 animate-pulse" : "text-green-400"} />
                        <span className="text-xs font-bold text-white">System Status</span>
                    </div>
                    {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronUp size={16} className="text-gray-400" />}
                </div>

                {/* Content */}
                {isExpanded && (
                    <div className="p-4 space-y-4">
                        {/* Connection Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isOffline || error ? (
                                    <WifiOff size={16} className="text-red-400" />
                                ) : (
                                    <Wifi size={16} className="text-green-400" />
                                )}
                                <span className={`text-xs font-medium ${isOffline || error ? "text-red-400" : "text-green-400"}`}>
                                    {isOffline ? "Offline / Error" : "Connected"}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-500">
                                Poll: {POLL_INTERVAL / 1000}s
                            </span>
                        </div>

                        {/* Last Fetched */}
                        <div className="text-xs text-gray-400">
                            Last Updated: <span className="text-white font-mono">
                                {lastFetched ? lastFetched.toLocaleTimeString() : 'Never'}
                            </span>
                        </div>

                        {/* Data Counts */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-[#0B1437] p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-gray-500 block uppercase">Students</span>
                                <span className="text-sm font-bold text-white">{students.length}</span>
                            </div>
                            <div className="bg-[#0B1437] p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-gray-500 block uppercase">Attendance</span>
                                <span className="text-sm font-bold text-white">{attendance_report.length}</span>
                            </div>
                            <div className="bg-[#0B1437] p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-gray-500 block uppercase">Courses</span>
                                <span className="text-sm font-bold text-white">{courses.length}</span>
                            </div>
                            <div className="bg-[#0B1437] p-2 rounded-lg border border-white/5">
                                <span className="text-[10px] text-gray-500 block uppercase">Batches</span>
                                <span className="text-sm font-bold text-white">{batches.length}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            // onClick={refreshData}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Force Refresh
                        </button>

                        {/* Error Log */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-[10px] text-red-300 break-words font-mono">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebugPanel;
