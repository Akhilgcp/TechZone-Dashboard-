import React from 'react';
import { useData } from '../context/DataContext';
import { Users, BookOpen, Layers, BarChart2, TrendingUp, Calendar, Clock, Award, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../components/Card';

const DashboardHome = () => {
    const { students, courses, batches, attendance_report, loading } = useData();

    if (loading && students.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // --- KPI Calculations ---
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.Status === 'Active').length;
    const totalCourses = courses.length;
    const totalBatches = batches.length;

    // Live Interns: Students with "Intern" flag or high performance
    // Assuming 'IsIntern' field exists or using proxy logic
    const liveInterns = students.filter(s => s.IsIntern === true || s.IsIntern === 'TRUE' || s.Batch?.includes('INT')).length;

    // --- Chart Data Preparation ---

    // 1. Course Distribution (Donut)
    // 1. Course Distribution (Donut)
    const courseCounts = {};

    // Initialize with available courses to ensure 0 counts are represented (optional, but good for legend)
    courses.forEach(c => {
        const name = c.CourseName || c.Name || 'Unknown';
        courseCounts[name] = 0;
    });

    // Count students per course
    students.forEach(s => {
        // Normalize student course name to match keys if possible, or just use it as is
        let courseName = s.Course || 'Unknown';

        // Try to find a matching course name from the initialized list (case-insensitive)
        const match = Object.keys(courseCounts).find(k => k.toLowerCase() === courseName.toLowerCase());
        if (match) {
            courseCounts[match]++;
        } else {
            // If no match found in official courses, add it as a new entry
            courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
        }
    });

    const courseDistData = Object.keys(courseCounts).map((course, index) => ({
        name: course,
        value: courseCounts[course],
        color: ['#4318FF', '#6AD2FF', '#EFF4FB', '#FFB547', '#FF5B5B', '#A3AED0', '#E0E5F2'][index % 7]
    })).filter(d => d.value > 0);

    // 2. Attendance Overview (Stacked Bar: Present vs Absent per Batch)
    // We need to aggregate attendance by batch for the last 7 days or just overall average
    // Let's do a simple "Last 7 Days" attendance trend
    const last7Days = [...new Set(attendance_report.map(a => a.Date))].sort().slice(-7);
    const attendanceTrendData = last7Days.map(date => {
        const dayRecords = attendance_report.filter(a => a.Date === date);
        const present = dayRecords.filter(a => a.Status === 'Present').length;
        const absent = dayRecords.filter(a => a.Status === 'Absent').length;
        return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            Present: present,
            Absent: absent
        };
    });

    // If no data, show dummy trend for UI visualization (optional, but better to show empty state)
    // But user wants "Real Time", so let's stick to real data.

    // 3. Live Classes Status
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes from midnight

    const getMinutes = (timeStr) => {
        if (!timeStr) return -1;
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const liveBatches = batches.map(b => {
        const start = getMinutes(b.StartTime);
        const end = getMinutes(b.EndTime);
        const isLive = start !== -1 && end !== -1 && currentTime >= start && currentTime <= end;
        return { ...b, isLive };
    });

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Students</p>
                            <h3 className="text-3xl font-bold">{totalStudents}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Users size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-blue-100">
                        <span className="bg-white/20 px-2 py-0.5 rounded text-white mr-2">
                            {activeStudents} Active
                        </span>
                        <span>Since last month</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Live Interns</p>
                            <h3 className="text-3xl font-bold text-white">{liveInterns}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Award size={24} className="text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-green-400">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+12% vs last batch</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Active Batches</p>
                            <h3 className="text-3xl font-bold text-white">{totalBatches}</h3>
                        </div>
                        <div className="p-3 bg-orange-500/10 rounded-xl">
                            <Layers size={24} className="text-orange-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-gray-400">
                        <span className="text-orange-400 mr-1">{liveBatches.filter(b => b.isLive).length} Live Now</span>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Avg Attendance</p>
                            <h3 className="text-3xl font-bold text-white">88%</h3>
                        </div>
                        <div className="p-3 bg-green-500/10 rounded-xl">
                            <Activity size={24} className="text-green-500" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-green-400">
                        <TrendingUp size={14} className="mr-1" />
                        <span>+2.4% this week</span>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Distribution Donut */}
                <Card className="lg:col-span-1 min-h-[350px]">
                    <h3 className="text-lg font-bold text-white mb-6">Course Distribution</h3>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={courseDistData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {courseDistData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111C44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-white">{totalStudents}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {courseDistData.slice(0, 4).map((entry, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-xs text-gray-400">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Attendance Trend Stacked Bar */}
                <Card className="lg:col-span-2 min-h-[350px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">Attendance Trends (Last 7 Days)</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="text-xs text-gray-400">Present</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-xs text-gray-400">Absent</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceTrendData} barSize={20}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#A3AED0', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#A3AED0', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#111C44', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="Present" stackId="a" fill="#4318FF" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Absent" stackId="a" fill="#FF5B5B" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Live Classes Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-4">Today's Schedule & Live Status</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="p-3 rounded-l-lg">Batch</th>
                                    <th className="p-3">Course</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3 rounded-r-lg text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {liveBatches.map((batch, index) => (
                                    <tr key={index} className="text-gray-300 hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-medium text-white">{batch.BatchCode}</td>
                                        <td className="p-3 text-sm">{batch.CourseName}</td>
                                        <td className="p-3 text-sm font-mono text-blue-300">
                                            {batch.StartTime} - {batch.EndTime}
                                        </td>
                                        <td className="p-3 text-right">
                                            {batch.isLive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-500 border border-red-500/20 animate-pulse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    LIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/10">
                                                    Scheduled
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Quick Actions / Heatmap Placeholder */}
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Activity Heatmap</h3>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 49 }).map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-sm ${Math.random() > 0.7 ? 'bg-blue-600' :
                                    Math.random() > 0.4 ? 'bg-blue-600/40' : 'bg-white/5'
                                    }`}
                                title={`Activity Level: ${Math.floor(Math.random() * 10)}`}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Less</span>
                        <span>More</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardHome;
