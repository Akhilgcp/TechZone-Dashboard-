import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE, POLL_INTERVAL } from '../config';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        students: [],
        attendance_report: [],
        courses: [],
        batches: [],
        loading: true,
        error: null,
        lastFetched: null,
        isOffline: false
    });

    const [globalFilter, setGlobalFilter] = useState({ batch: null, course: null });
    const pollTimerRef = useRef(null);
    const abortControllerRef = useRef(null);

    const fetchData = useCallback(async (isBackground = false) => {
        if (!isBackground) {
            setData(prev => ({ ...prev, loading: true, error: null }));
        }

        // Cancel previous request if pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            console.log(`[DataContext] Fetching from ${API_BASE}...`);
            const timeout = 6000; // 6s timeout
            const config = {
                signal: abortControllerRef.current.signal,
                timeout: timeout
            };

            // Parallel fetch
            const results = await Promise.allSettled([
                axios.get(`${API_BASE}?action=students`, config),
                axios.get(`${API_BASE}?action=attendance`, config),
                axios.get(`${API_BASE}?action=courses`, config),
                axios.get(`${API_BASE}?action=batches`, config)
            ]);

            const getBody = (res) => res.status === 'fulfilled' ? (res.value.data?.data || res.value.data || []) : [];

            const studentsRaw = getBody(results[0]);
            const attendanceRaw = getBody(results[1]);
            const coursesRaw = getBody(results[2]);
            const batchesRaw = getBody(results[3]);

            // Check for critical failures (e.g. all failed)
            const allFailed = results.every(r => r.status === 'rejected');
            if (allFailed) {
                throw new Error("Failed to connect to backend API.");
            }

            // Normalize Students Data
            const students = studentsRaw.map((s, index) => ({
                ...s,
                FullName: s.FullName || s.Name || 'Unknown Student',
                Batch: s.Batch || s.BatchCode || 'Unassigned',
                Course: s.Course || s.CourseName || 'General',
                StudentID: s.StudentID || s.ID || `TZ-${Math.floor(Math.random() * 10000)}`,
                ProgressPct: parseInt(s.ProgressPct || s.Progress || 0),
                AttendancePct: parseInt(s.AttendancePct || s.Attendance || 0),
                FeesStatus: s.FeesStatus || s.Fees || 'Pending',
            }));

            // Normalize Batches Data
            const batches = batchesRaw.map(b => ({
                ...b,
                BatchCode: b.BatchCode || b.Batch || 'Unknown',
                CourseName: b.CourseName || b.Course || 'Unknown Course',
                TrainerName: b.TrainerName || b.Trainer || 'Unassigned',
                StartTime: b.StartTime || '',
                EndTime: b.EndTime || '',
                BatchStatus: b.BatchStatus || (new Date(b.EndDate) < new Date() ? 'Completed' : 'Ongoing')
            }));

            // Normalize Courses Data
            const courses = coursesRaw.map(c => ({
                ...c,
                CourseName: c.CourseName || c.Name || 'Unknown Course',
                CourseCode: c.CourseCode || c.Code || 'N/A',
                Fees: c.Fees || 0,
                Duration: c.Duration || 'N/A'
            }));

            setData({
                students,
                attendance_report: attendanceRaw,
                courses,
                batches,
                loading: false,
                error: null,
                lastFetched: new Date(),
                isOffline: false
            });

        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("[DataContext] Request canceled", err.message);
                return;
            }
            console.error("[DataContext] Fetch Error:", err);

            setData(prev => ({
                ...prev,
                loading: false,
                error: err.message || "Failed to load data",
                isOffline: true,
            }));
        }
    }, []);

    const startPolling = (interval = POLL_INTERVAL) => {
        stopPolling();
        pollTimerRef.current = setInterval(() => {
            fetchData(true);
        }, interval);
        console.log(`[DataContext] Polling started (${interval}ms)`);
    };

    const stopPolling = () => {
        if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
            console.log("[DataContext] Polling stopped");
        }
    };

    // Initial Load & Polling
    useEffect(() => {
        fetchData();
        startPolling();

        return () => stopPolling();
    }, [fetchData]);

    const refreshData = () => fetchData(false);
    const getLastFetched = () => data.lastFetched;

    return (
        <DataContext.Provider value={{
            ...data,
            globalFilter,
            setGlobalFilter,
            refreshData,
            startPolling,
            stopPolling,
            getLastFetched
        }}>
            {children}
        </DataContext.Provider>
    );
};
