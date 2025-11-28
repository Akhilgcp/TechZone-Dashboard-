export const kpiData = {
    activeStudents: 1245,
    activeInterns: 320,
    internsTrend: 'up', // 'up' or 'down'
    totalStudents: {
        month: 150,
        year: 1200,
        overall: 5000
    },
    projects: {
        mini: 450,
        major: 120,
        live: 45
    },
    engagementScore: 85
};

export const courseProgressData = [
    { name: '0-25%', value: 15, color: '#FFB547' },
    { name: '25-50%', value: 25, color: '#6AD2FF' },
    { name: '50-75%', value: 35, color: '#4318FF' },
    { name: '75-100%', value: 25, color: '#05CD99' },
];

export const topStudents = [
    { id: 1, name: 'Rahul Sharma', course: 'Full Stack Dev', score: 98, attendance: 95, avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=random' },
    { id: 2, name: 'Priya Patel', course: 'Data Science', score: 96, attendance: 98, avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=random' },
    { id: 3, name: 'Amit Singh', course: 'UI/UX Design', score: 94, attendance: 92, avatar: 'https://ui-avatars.com/api/?name=Amit+Singh&background=random' },
    { id: 4, name: 'Sneha Gupta', course: 'Cyber Security', score: 92, attendance: 90, avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=random' },
];

export const attendanceData = [
    { name: 'Week 1', attendance: 85 },
    { name: 'Week 2', attendance: 88 },
    { name: 'Week 3', attendance: 92 },
    { name: 'Week 4', attendance: 90 },
    { name: 'Week 5', attendance: 95 },
];

export const feedbackData = [
    { name: 'Positive', value: 70, color: '#05CD99' },
    { name: 'Neutral', value: 20, color: '#FFB547' },
    { name: 'Negative', value: 10, color: '#EE5D50' },
];

export const trainerPerformance = [
    { name: 'John Doe', score: 4.8, subject: 'React' },
    { name: 'Jane Smith', score: 4.9, subject: 'Python' },
    { name: 'Mike Johnson', score: 4.5, subject: 'Java' },
    { name: 'Sarah Lee', score: 4.7, subject: 'UI/UX' },
];

export const batchCalendar = [
    { id: 1, name: 'FS-2023-A', start: '2023-01-10', end: '2023-06-10', status: 'Completed' },
    { id: 2, name: 'DS-2023-B', start: '2023-03-15', end: '2023-09-15', status: 'Ongoing' },
    { id: 3, name: 'UI-2023-C', start: '2023-06-01', end: '2023-11-01', status: 'Ongoing' },
    { id: 4, name: 'CS-2023-D', start: '2023-08-20', end: '2024-02-20', status: 'Upcoming' },
];

export const coursePopularity = [
    { name: 'Full Stack', value: 400 },
    { name: 'Data Science', value: 300 },
    { name: 'UI/UX', value: 200 },
    { name: 'Cyber Sec', value: 100 },
];
