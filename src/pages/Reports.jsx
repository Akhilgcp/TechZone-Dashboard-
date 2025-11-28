import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import '../Dashboard.css';

const COLORS = ['#4318FF', '#6AD2FF', '#05CD99', '#FFB547', '#E31A1A'];

const Reports = () => {
    const { students, batches, attendance_report, fees_report, performance_report, courses, loading } = useData();
    const [activeTab, setActiveTab] = useState('attendance');

    if (loading) return <div className="p-8 text-white">Loading reports data...</div>;

    // Helper to safely parse numbers
    const safeParseInt = (val) => {
        const parsed = parseInt(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    // --- Data Processing for Charts ---

    // Attendance: Daily Trend (attendance_report by Date)
    const attendanceTrendData = Object.values(attendance_report.reduce((acc, curr) => {
        let date = curr.Date;
        if (!date) return acc;
        date = String(date).trim();

        if (!acc[date]) acc[date] = { name: date, present: 0, absent: 0 };

        const status = String(curr.AttendanceStatus).toLowerCase();
        if (status === 'present' || status === 'p' || status === 'yes') acc[date].present++;
        else acc[date].absent++;

        return acc;
    }, {})).sort((a, b) => new Date(a.name) - new Date(b.name));

    // Fees: Total Fees Collected (SUM(fees_report.FeesPaid))
    const totalFeesCollected = fees_report.reduce((acc, curr) => acc + safeParseInt(curr.FeesPaid), 0);

    // Fees: Course-wise Revenue (MAP courses.courseName with fees_report totals)
    // Join fees_report with students to get Course, then group by Course
    const courseRevenue = fees_report.reduce((acc, fee) => {
        const student = students.find(s => s.StudentID === fee.StudentID);
        if (student) {
            const course = student.Course;
            acc[course] = (acc[course] || 0) + safeParseInt(fee.FeesPaid);
        }
        return acc;
    }, {});

    const revenueData = Object.keys(courseRevenue).map(course => ({
        name: course,
        value: courseRevenue[course]
    }));

    // Performance: Average Scores
    const avgPerformance = [
        { name: 'Project', score: 0, count: 0 },
        { name: 'Assignment', score: 0, count: 0 },
        { name: 'Test', score: 0, count: 0 },
    ];

    performance_report.forEach(p => {
        avgPerformance[0].score += safeParseInt(p.ProjectScore);
        avgPerformance[1].score += safeParseInt(p.AssignmentScore);
        avgPerformance[2].score += safeParseInt(p.TestScore);
        avgPerformance.forEach(item => item.count++);
    });

    const performanceData = avgPerformance.map(item => ({
        name: item.name,
        score: Math.round(item.score / (item.count || 1))
    }));

    // Batch Health: Aggregations
    // We need to calculate attendance and engagement avg per batch dynamically

    // 1. Map students to batches
    const studentsByBatch = students.reduce((acc, s) => {
        if (!acc[s.Batch]) acc[s.Batch] = [];
        acc[s.Batch].push(s.StudentID);
        return acc;
    }, {});

    // 2. Calculate Batch Attendance
    const batchAttendance = {};
    attendance_report.forEach(r => {
        const student = students.find(s => s.StudentID === r.StudentID);
        if (student && student.Batch) {
            if (!batchAttendance[student.Batch]) batchAttendance[student.Batch] = { total: 0, present: 0 };
            batchAttendance[student.Batch].total++;
            const status = String(r.AttendanceStatus).toLowerCase();
            if (status === 'present' || status === 'p' || status === 'yes') {
                batchAttendance[student.Batch].present++;
            }
        }
    });

    // 3. Calculate Batch Engagement
    const batchEngagement = {};
    performance_report.forEach(p => {
        const student = students.find(s => s.StudentID === p.StudentID);
        if (student) {
            const batch = student.Batch;
            if (!batchEngagement[batch]) batchEngagement[batch] = { total: 0, count: 0 };
            batchEngagement[batch].total += safeParseInt(p.EngagementScore);
            batchEngagement[batch].count++;
        }
    });

    // --- Render Components ---

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Reports Hub</h1>
                <p className="text-gray-400 text-sm">Comprehensive analytics and insights</p>
            </div>

            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
                <TabButton id="attendance" label="Attendance" icon={Calendar} />
                <TabButton id="fees" label="Fees & Revenue" icon={DollarSign} />
                <TabButton id="performance" label="Performance" icon={TrendingUp} />
                <TabButton id="batch" label="Batch Health" icon={Activity} />
            </div>

            {/* Attendance Report */}
            {activeTab === 'attendance' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">Daily Attendance Trend</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={attendanceTrendData}>
                                        <defs>
                                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4318FF" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#A3AED0" />
                                        <YAxis stroke="#A3AED0" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="present" stroke="#4318FF" fillOpacity={1} fill="url(#colorPresent)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4">Low Attendance Alerts</h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {students.filter(s => parseInt(s.AttendancePct) < 75).map((student, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                                <AlertCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">{student.FullName}</h4>
                                                <p className="text-red-400 text-xs">{student.Batch} • {student.Course}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-red-500">{student.AttendancePct}%</div>
                                            <div className="text-xs text-red-400">Attendance</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Fees Report */}
            {activeTab === 'fees' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">Revenue by Course</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                        <XAxis type="number" stroke="#A3AED0" />
                                        <YAxis dataKey="name" type="category" stroke="#A3AED0" width={150} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="value" fill="#05CD99" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">Fee Status Distribution</h3>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Paid', value: students.filter(s => s.FeesStatus === 'Paid').length },
                                                { name: 'Pending', value: students.filter(s => s.FeesStatus === 'Pending').length },
                                                { name: 'Overdue', value: students.filter(s => s.FeesStatus === 'Overdue').length }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#05CD99" />
                                            <Cell fill="#FFB547" />
                                            <Cell fill="#E31A1A" />
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-white mb-4">Pending Fees List</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-400 text-sm border-b border-white/10">
                                    <tr>
                                        <th className="p-3">Student</th>
                                        <th className="p-3">Total Fees</th>
                                        <th className="p-3">Paid</th>
                                        <th className="p-3">Pending</th>
                                        <th className="p-3">Last Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white">
                                    {fees_report.filter(f => parseInt(f.PendingAmount) > 0).map((record, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-3 font-medium">{students.find(s => s.StudentID === record.StudentID)?.FullName || record.StudentID}</td>
                                            <td className="p-3">₹{record.TotalFees}</td>
                                            <td className="p-3 text-green-400">₹{record.FeesPaid}</td>
                                            <td className="p-3 text-red-400 font-bold">₹{record.PendingAmount}</td>
                                            <td className="p-3 text-gray-400">{record.LastPaymentDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Report */}
            {activeTab === 'performance' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-6">Average Performance Metrics</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#A3AED0" />
                                        <YAxis stroke="#A3AED0" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }} />
                                        <Bar dataKey="score" fill="#4318FF" radius={[4, 4, 0, 0]} barSize={40}>
                                            {performanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4">Top Performers</h3>
                            <div className="space-y-4">
                                {performance_report
                                    .sort((a, b) => (parseInt(b.TestScore) || 0) - (parseInt(a.TestScore) || 0))
                                    .slice(0, 5)
                                    .map((p, i) => {
                                        const student = students.find(s => s.StudentID === p.StudentID);
                                        return (
                                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold">
                                                        #{i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-medium">{student?.FullName || p.StudentID}</h4>
                                                        <p className="text-gray-400 text-xs">Test Score</p>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-yellow-400">{p.TestScore}</div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch Health Report */}
            {activeTab === 'batch' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {batches.map((batch, i) => {
                        const engagement = batchEngagement[batch.BatchCode];
                        const avgEngagement = engagement ? Math.round(engagement.total / engagement.count) : 0;

                        const attendance = batchAttendance[batch.BatchCode];
                        const avgAttendance = attendance ? Math.round((attendance.present / attendance.total) * 100) : 0;

                        const totalStudents = studentsByBatch[batch.BatchCode]?.length || 0;

                        return (
                            <div key={i} className="bg-[#111C44]/80 backdrop-blur-xl p-6 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-colors group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{batch.BatchCode}</h3>
                                        <p className="text-gray-400 text-sm">{batch.CourseName}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${batch.BatchStatus === 'Ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {batch.BatchStatus}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Attendance Avg</span>
                                            <span className="text-white font-bold">{avgAttendance}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${avgAttendance}%` }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Engagement Avg</span>
                                            <span className="text-white font-bold">{avgEngagement}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500" style={{ width: `${avgEngagement}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-white/5 p-3 rounded-lg">
                                            <div className="text-xs text-gray-400">Trainer</div>
                                            <div className="text-white font-medium text-sm truncate">{batch.TrainerName}</div>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-lg">
                                            <div className="text-xs text-gray-400">Students</div>
                                            <div className="text-white font-medium text-sm">{totalStudents}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reports;
