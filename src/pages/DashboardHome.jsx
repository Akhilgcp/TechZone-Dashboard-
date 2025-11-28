import React from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, TrendingUp, Award, CheckCircle, Star, Activity, Zap } from 'lucide-react';
import '../Dashboard.css';

const DashboardHome = () => {
    const { students, batches, performance_report, attendance_report, loading, globalFilter, setGlobalFilter } = useData();

    if (loading) return <div className="p-8 text-white">Loading dashboard data...</div>;

    // Defensive check: Ensure data is valid arrays
    if (!Array.isArray(students) || !Array.isArray(attendance_report)) {
        return <div className="p-8 text-red-400">Error: Invalid data format received from API. Please check the console.</div>;
    }

    // --- Dynamic Data Calculation with Global Filter ---

    // Filter students based on global selection
    const filteredStudents = students.filter(s => {
        if (globalFilter.batch && s.Batch !== globalFilter.batch) return false;
        // Course filtering might need derivation if Course isn't in student object, 
        // but for now we assume simple batch filtering is primary.
        return true;
    });

    // Helper to safely parse numbers
    const safeParseInt = (val) => {
        const parsed = parseInt(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    // KPIs
    const activeStudents = filteredStudents.length;

    // Active Interns: For now, just count students with > 80% attendance (calculated dynamically)
    // We need to calculate attendance % per student first
    const studentAttendanceStats = filteredStudents.map(s => {
        const studentRecords = attendance_report.filter(a => a.Name === s.Name);
        const presentCount = studentRecords.filter(a => String(a.AttendanceStatus).toLowerCase() === 'present').length;
        const totalDays = studentRecords.length || 1; // Avoid division by zero
        return { ...s, attendancePct: (presentCount / totalDays) * 100 };
    });

    const activeInterns = studentAttendanceStats.filter(s => s.attendancePct > 80).length;

    const totalTrained = filteredStudents.length;

    // Attendance Health: Plot attendance_report by Date for filtered students
    const filteredAttendance = attendance_report.filter(a => filteredStudents.some(s => s.Name === a.Name));

    // Group by Date and calculate average attendance
    const attendanceByDate = filteredAttendance.reduce((acc, curr) => {
        let date = curr.Date;
        if (!date) return acc;
        date = String(date).trim(); // Normalize

        if (!acc[date]) {
            acc[date] = { total: 0, present: 0 };
        }
        acc[date].total++; // Total records for that day (or total students expected? Using records for now)

        const status = String(curr.AttendanceStatus).toLowerCase();
        if (status === 'present' || status === 'p' || status === 'yes') {
            acc[date].present++;
        }
        return acc;
    }, {});

    const attendanceData = Object.keys(attendanceByDate).map(date => ({
        name: date,
        attendance: Math.round((attendanceByDate[date].present / attendanceByDate[date].total) * 100)
    })).sort((a, b) => new Date(a.name) - new Date(b.name));

    // Course Progress Donut: Placeholder until we have ProgressPct in Sheets
    // We'll simulate it based on CreatedAt vs Batch StartDate if possible, or just mock for now
    const courseProgressData = [
        { name: '0-25%', value: filteredStudents.length * 0.1, color: '#E31A1A' },
        { name: '25-50%', value: filteredStudents.length * 0.3, color: '#FFB547' },
        { name: '50-75%', value: filteredStudents.length * 0.4, color: '#6AD2FF' },
        { name: '75-100%', value: filteredStudents.length * 0.2, color: '#05CD99' },
    ];

    // Trainer Ratings: Avg rating from attendance_report grouped by Batch
    const batchRatings = {};
    filteredAttendance.forEach(a => {
        if (a.Batch && a.TrainerRating) {
            if (!batchRatings[a.Batch]) {
                batchRatings[a.Batch] = { total: 0, count: 0 };
            }
            batchRatings[a.Batch].total += safeParseInt(a.TrainerRating);
            batchRatings[a.Batch].count++;
        }
    });

    const trainerPerformance = Object.keys(batchRatings).map(batch => ({
        name: `Batch ${batch}`,
        subject: "N/A",
        score: (batchRatings[batch].total / batchRatings[batch].count).toFixed(1)
    })).slice(0, 5);

    // Batch Calendar
    const batchCalendar = batches.slice(0, 5).map(b => ({
        id: b.BatchCode,
        name: `${b.CourseName} (${b.BatchCode})`,
        start: b.StartDate,
        end: b.EndDate,
        status: b.BatchStatus,
        isActive: globalFilter.batch === b.BatchCode
    }));

    // Projects Completed: Placeholder
    const projects = {
        mini: 12,
        major: 5,
        live: 2,
    };

    // Today's Absentees Logic
    const today = new Date().toLocaleDateString(); // Matches Google Script format (M/D/YYYY usually)
    // Note: Date formats might vary, robust parsing recommended in production
    const todayAttendance = attendance_report.filter(a => a.Date === today);
    const presentNames = new Set(todayAttendance.map(a => a.Name));

    const absenteesCount = filteredStudents.filter(s => !presentNames.has(s.Name)).length;

    const todayAvgRating = todayAttendance.length > 0
        ? (todayAttendance.reduce((acc, curr) => acc + safeParseInt(curr.TrainerRating), 0) / todayAttendance.length).toFixed(1)
        : "N/A";

    return (
        <div className="dashboard-grid">
            {/* Filter Indicator */}
            {(globalFilter.batch || globalFilter.course) && (
                <div className="col-span-full bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl flex justify-between items-center mb-4 animate-fade-in">
                    <span className="text-blue-300 text-sm font-medium">
                        Filtering by: {globalFilter.batch ? `Batch ${globalFilter.batch}` : ''} {globalFilter.course ? `Course ${globalFilter.course}` : ''}
                    </span>
                    <button
                        onClick={() => setGlobalFilter({ batch: null, course: null })}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                        Clear Filter
                    </button>
                </div>
            )}

            {/* Row 1: Top KPIs */}
            <div className="kpi-section">
                <Card className="kpi-card active-students">
                    <div className="kpi-icon-wrapper pulse">
                        <Users size={24} color="#fff" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Active Students</p>
                        <h2 className="kpi-value">{activeStudents.toLocaleString()} <span className="live-badge">LIVE</span></h2>
                    </div>
                </Card>

                <Card className="kpi-card">
                    <div className="kpi-icon-wrapper blue">
                        <TrendingUp size={24} color="#fff" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Today's Avg Rating</p>
                        <h2 className="kpi-value">{todayAvgRating} <span className="text-sm text-gray-400">/ 5</span></h2>
                    </div>
                </Card>

                <Card className="kpi-card">
                    <div className="kpi-icon-wrapper green">
                        <CheckCircle size={24} color="#fff" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Total Trained</p>
                        <h2 className="kpi-value">{totalTrained.toLocaleString()}</h2>
                        <div className="mini-progress">
                            <div className="bar" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                </Card>

                <Card className="kpi-card">
                    <div className="kpi-icon-wrapper orange">
                        <Activity size={24} color="#fff" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Today's Absentees</p>
                        <h2 className="kpi-value text-red-400">{absenteesCount}</h2>
                    </div>
                </Card>
            </div>

            {/* Row 2: Charts */}
            <div className="charts-row">
                <Card title="Attendance Health" className="chart-card large">
                    {attendanceData && attendanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={attendanceData}>
                                <defs>
                                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4318FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#A3AED0"
                                    tickFormatter={(str) => {
                                        const date = new Date(str);
                                        if (isNaN(date.getTime())) return str;
                                        return `${date.getDate()}/${date.getMonth() + 1}`;
                                    }}
                                />
                                <YAxis axisLine={false} tickLine={false} stroke="#A3AED0" />
                                <Tooltip contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                <Area type="monotone" dataKey="attendance" stroke="#4318FF" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No attendance data available yet
                        </div>
                    )}
                </Card>

                <Card title="Course Progress" className="chart-card">
                    {courseProgressData && courseProgressData.some(d => d.value > 0) ? (
                        <div className="donut-chart-container">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={courseProgressData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                            const RADIAN = Math.PI / 180;
                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                            return (
                                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                    {`${(percent * 100).toFixed(0)}%`}
                                                </text>
                                            );
                                        }}
                                    >
                                        {courseProgressData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="chart-legend">
                                {courseProgressData.map((item, index) => (
                                    <div key={index} className="legend-item">
                                        <span className="dot" style={{ backgroundColor: item.color }}></span>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            No course progress data available
                        </div>
                    )}
                </Card>
            </div>

            {/* Row 3: Feedback & Trainer Ratings */}
            <div className="info-row">
                <Card title="Student Feedback" className="feedback-card">
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4">
                        Feedback data pending upload
                    </div>
                </Card>

                <Card title="Trainer Ratings" className="trainers-card">
                    <div className="trainers-list">
                        {trainerPerformance.length > 0 ? trainerPerformance.map((trainer, index) => (
                            <div key={index} className="trainer-item">
                                <div className="trainer-info">
                                    <h4>{trainer.name}</h4>
                                    <p>{trainer.subject}</p>
                                </div>
                                <div className="rating-stars">
                                    <Star size={16} fill="#FFB547" color="#FFB547" />
                                    <span>{trainer.score}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-gray-400 text-sm p-4 text-center">No ratings available yet</div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Row 4: Calendar & Projects */}
            <div className="bottom-row">
                <Card title="Batch Calendar" className="calendar-card">
                    <div className="timeline">
                        {batchCalendar.map(batch => (
                            <div
                                key={batch.id}
                                className={`timeline-item ${batch.status === 'Ongoing' ? 'ongoing' : batch.status === 'Completed' ? 'completed' : 'upcoming'} ${batch.isActive ? 'ring-2 ring-blue-500 bg-white/10' : ''} cursor-pointer hover:bg-white/5 transition-all`}
                                onClick={() => setGlobalFilter(prev => ({ ...prev, batch: prev.batch === batch.id ? null : batch.id }))}
                            >
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <h4>{batch.name}</h4>
                                    <p>{batch.start} - {batch.end}</p>
                                    <span className={`status-badge ${batch.status === 'Ongoing' ? 'ongoing' : batch.status === 'Completed' ? 'completed' : 'upcoming'}`}>{batch.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Projects Completed" className="projects-card">
                    <div className="projects-grid">
                        <div className="project-stat">
                            <div className="icon-box mini"><Zap size={20} /></div>
                            <h3>{projects.mini}</h3>
                            <p>Mini</p>
                        </div>
                        <div className="project-stat">
                            <div className="icon-box major"><Award size={20} /></div>
                            <h3>{projects.major}</h3>
                            <p>Major</p>
                        </div>
                        <div className="project-stat">
                            <div className="icon-box live"><Activity size={20} /></div>
                            <h3>{projects.live}</h3>
                            <p>Live</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
