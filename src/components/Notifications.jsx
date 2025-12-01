import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config';
import { useData } from '../context/DataContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const lastCountRef = useRef(0);
    const { attendance_report } = useData();

    // Effect to detect new attendance entries
    useEffect(() => {
        if (attendance_report.length > 0) {
            const newCount = attendance_report.length;

            // If this is not the first load and count increased
            if (lastCountRef.current > 0 && newCount > lastCountRef.current) {
                const diff = newCount - lastCountRef.current;
                const newEntries = attendance_report.slice(0, diff); // Assuming newest are first, but usually API returns oldest first? 
                // Actually, let's just say "New attendance marked" generic for now unless we sort.
                // Or better, just add a notification about the count.

                const newNotification = {
                    id: Date.now(),
                    title: 'New Attendance Marked',
                    message: `${diff} new student(s) marked present.`,
                    time: new Date().toLocaleTimeString(),
                    read: false
                };

                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            }

            lastCountRef.current = newCount;
        }
    }, [attendance_report]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0); // Mark all as read when opening
        }
    };

    return (
        <div className="relative">
            <button
                onClick={toggleOpen}
                className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111C44] animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-[#111C44] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-bold text-white text-sm">Notifications</h3>
                                <button
                                    onClick={() => setNotifications([])}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-xs">
                                        No new notifications
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {notifications.map(notif => (
                                            <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors">
                                                <div className="flex gap-3">
                                                    <div className="mt-1 p-1.5 bg-green-500/20 rounded-full h-fit">
                                                        <CheckCircle size={12} className="text-green-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                                                        <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                                                        <span className="text-[10px] text-gray-500 mt-2 block">{notif.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;
