import React from 'react';
import { useData } from '../context/DataContext';
import { BarChart2, TrendingUp, Users, Calendar } from 'lucide-react';

const ReportsHub = () => {
    const { students, batches } = useData();

    // Simple stats for reports
    const totalStudents = students.length;
    const paidStudents = students.filter(s => s.FeesStatus === 'Paid').length;
    const pendingStudents = totalStudents - paidStudents;
    const revenue = paidStudents * 50000; // Approx dummy calc

    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Reports Hub</h1>
                <p className="text-gray-400 text-sm">Analytics and performance insights</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#111C44] p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{revenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                        <TrendingUp size={12} />
                        <span>+12% this month</span>
                    </div>
                </div>
                <div className="bg-[#111C44] p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Paid Students</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{paidStudents}</h3>
                </div>
                <div className="bg-[#111C44] p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Pending Fees</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{pendingStudents}</h3>
                </div>
                <div className="bg-[#111C44] p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-xs uppercase">Active Batches</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{batches.length}</h3>
                </div>
            </div>

            {/* Placeholder Charts Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111C44] p-6 rounded-2xl border border-white/5 h-80 flex flex-col items-center justify-center text-gray-500">
                    <BarChart2 size={48} className="mb-4 opacity-50" />
                    <p>Attendance Trends Chart (Coming Soon)</p>
                </div>
                <div className="bg-[#111C44] p-6 rounded-2xl border border-white/5 h-80 flex flex-col items-center justify-center text-gray-500">
                    <Users size={48} className="mb-4 opacity-50" />
                    <p>Student Growth Chart (Coming Soon)</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsHub;
