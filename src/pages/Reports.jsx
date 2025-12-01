import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Activity, AlertCircle } from 'lucide-react';
import '../Dashboard.css';

const Reports = () => {
    const { students, batches, attendance_report, loading } = useData();
    const [activeTab, setActiveTab] = useState('attendance');

    if (loading) return <div className="p-8 text-white">Loading reports data...</div>;

    // --- Data Processing for Charts ---

    // Attendance: Daily Trend (attendance_report by Date)
    const attendanceTrendData = Object.values(attendance_report.reduce((acc, curr) => {
        let date = curr.Date;
        if (!date) return acc;
        // Format date if needed, assuming ISO or readable string
        date = String(date).split('T')[0];

        if (!acc[date]) acc[date] = { name: date, present: 0, absent: 0 };

        const status = String(curr.AttendanceStatus).toLowerCase();
        if (status === 'present' || status === 'p' || status === 'yes') acc[date].present++;
        else acc[date].absent++;

        return acc;
    }, {})).sort((a, b) => new Date(a.name) - new Date(b.name));

    // Batch Health: Aggregations
    // 1. Map students to batches
    const studentsByBatch = students.reduce((acc, s) => {
        if (!acc[s.Batch]) acc[s.Batch] = [];
        acc[s.Batch].push(s.StudentID);
        return acc;
    }, {});

    // 2. Calculate Batch Attendance
    const batchAttendance = {};
    attendance_report.forEach(r => {
        const student = students.find(s => s.FullName === r.Name); // Match by Name as ID might be generated
        if (student && student.Batch) {
            if (!batchAttendance[student.Batch]) batchAttendance[student.Batch] = { total: 0, present: 0 };
            batchAttendance[student.Batch].total++;
            const status = String(r.AttendanceStatus).toLowerCase();
            if (status === 'present' || status === 'p' || status === 'yes') {
                batchAttendance[student.Batch].present++;
            }
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
                                        <XAxis dataKey="name" stroke="#A3AED0" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                                        <YAxis stroke="#A3AED0" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1B254B', border: 'none', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
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
                                {students.filter(s => parseInt(s.AttendancePct) < 75).length === 0 && (
                                    <div className="text-gray-400 text-center py-10">All students have good attendance!</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch Health Report */}
            {activeTab === 'batch' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {batches.map((batch, i) => {
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

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-white/5 p-3 rounded-lg">
                                            <div className="text-xs text-gray-400">Trainer</div>
                                            <div className="text-white font-medium text-sm truncate">{batch.TrainerName || "Assigned"}</div>
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
