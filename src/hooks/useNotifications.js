import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { POLL_INTERVAL } from '../config';

export const useNotifications = () => {
    const { attendance_report } = useData();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const lastCheckRef = useRef(new Date());

    useEffect(() => {
        // Initial check to avoid flooding on load
        lastCheckRef.current = new Date();
    }, []);

    useEffect(() => {
        if (!attendance_report.length) return;

        const checkForNewAttendance = () => {
            const now = new Date();
            const recent = attendance_report.filter(a => {
                const recordDate = new Date(a.Timestamp || a.Date); // Assuming Timestamp exists or using Date
                return recordDate > lastCheckRef.current;
            });

            if (recent.length > 0) {
                const newNotifs = recent.map(r => ({
                    id: Date.now() + Math.random(),
                    title: 'New Attendance',
                    message: `${r.Name} marked as ${r.AttendanceStatus}`,
                    time: new Date(),
                    read: false,
                    type: 'info'
                }));

                setNotifications(prev => [...newNotifs, ...prev].slice(0, 50)); // Keep last 50
                setUnreadCount(prev => prev + newNotifs.length);
                lastCheckRef.current = now;
            }
        };

        // Check every poll interval (or slightly offset)
        const timer = setInterval(checkForNewAttendance, POLL_INTERVAL);
        return () => clearInterval(timer);
    }, [attendance_report]);

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    return { notifications, unreadCount, markAllAsRead };
};
