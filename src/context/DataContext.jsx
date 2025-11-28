import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        students: [],
        courses: [],
        batches: [],
        attendance_report: [],
        fees_report: [],
        performance_report: [],
        loading: true,
        error: null
    });

    // Global Filter State for "Power BI" style cross-filtering
    const [globalFilter, setGlobalFilter] = useState({
        batch: null,
        course: null
    });

    // IMPORTANT: Update this URL after deploying the Google Apps Script
    const API_URL = "https://script.google.com/macros/s/AKfycbyd5h-CD_QkkXOWXGLmK4wN9RH87ZFnDYnU_evZnuwgJikvOHwmC0Gp3OoZAKMB5nvKtw/exec";

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Students
                const studentsRes = await fetch(`${API_URL}?action=students`);
                const studentsData = await studentsRes.json();

                // Fetch Attendance
                const attendanceRes = await fetch(`${API_URL}?action=attendance`);
                const attendanceData = await attendanceRes.json();

                // Validate data is array, else default to empty
                const validStudents = Array.isArray(studentsData) ? studentsData : [];
                const validAttendance = Array.isArray(attendanceData) ? attendanceData : [];

                if (!Array.isArray(studentsData) || !Array.isArray(attendanceData)) {
                    console.warn("API returned non-array data:", { students: studentsData, attendance: attendanceData });
                }

                // Mock other data for now (Courses, Batches) since they aren't in the Sheet yet
                // In a full system, these would also come from the API
                const mockCourses = [
                    { CourseName: "Full Stack Development", CourseCode: "FSD101", DifficultyLevel: "Intermediate", Duration: "6 Months", Fees: 45000, ActiveBatches: 2, TotalHours: 120, SyllabusOverview: "React, Node, MongoDB" },
                    { CourseName: "Data Science", CourseCode: "DS201", DifficultyLevel: "Advanced", Duration: "8 Months", Fees: 60000, ActiveBatches: 1, TotalHours: 160, SyllabusOverview: "Python, ML, AI" }
                ];

                const mockBatches = [
                    { BatchCode: "B001", CourseName: "Full Stack Development", StartDate: "2025-01-10", EndDate: "2025-07-10", BatchStatus: "Ongoing" },
                    { BatchCode: "B002", CourseName: "Data Science", StartDate: "2025-02-15", EndDate: "2025-10-15", BatchStatus: "Upcoming" }
                ];

                const newData = {
                    students: validStudents,
                    attendance_report: validAttendance,
                    courses: mockCourses,
                    batches: mockBatches,
                    fees_report: [], // Placeholder
                    performance_report: [], // Placeholder, or derive from attendance ratings
                    loading: false,
                    error: null
                };

                console.log("Loaded Data from API:", newData);
                setData(prev => ({ ...prev, ...newData }));
            } catch (err) {
                console.error("Error loading API data:", err);
                // Keep loading false but show error, ensure arrays are empty to prevent crash
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: err,
                    students: [],
                    courses: [],
                    batches: [],
                    fees_report: [],
                    performance_report: [],
                    attendance_report: []
                }));
            }
        };

        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ ...data, globalFilter, setGlobalFilter }}>
            {children}
        </DataContext.Provider>
    );
};
