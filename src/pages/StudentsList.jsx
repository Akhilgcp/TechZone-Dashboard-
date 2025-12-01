import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, Plus, MoreVertical, User, BookOpen, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentsList = () => {
    const { students, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBatch, setFilterBatch] = useState('All');
    const navigate = useNavigate();

    // Filter logic
    const filteredStudents = students.filter(student => {
        if (!student) return false;
        const name = student.FullName ? String(student.FullName).toLowerCase() : '';
        const id = student.StudentID ? String(student.StudentID).toLowerCase() : '';
        const term = searchTerm.toLowerCase();

        const matchesSearch = name.includes(term) || id.includes(term);
        const matchesBatch = filterBatch === 'All' || student.Batch === filterBatch;
        return matchesSearch && matchesBatch;
    });

    // Unique batches for filter
    const batches = ['All', ...new Set(students.map(s => s.Batch))];

    if (loading) {
        return <div className="text-white p-8">Loading students...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Students Directory</h1>
                    <p className="text-gray-400 text-sm">Manage and view all registered students</p>
                </div>
                <button
                    onClick={() => navigate('/students/register')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} />
                    <span>Add New Student</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-[#111C44] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0B1437] border border-white/10 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={filterBatch}
                        onChange={(e) => setFilterBatch(e.target.value)}
                        className="bg-[#0B1437] border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        {batches.map(b => <option key={b} value={b}>{b === 'All' ? 'All Batches' : b}</option>)}
                    </select>
                </div>
            </div>

            {/* Students Table/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                        <motion.div
                            key={student.StudentID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-[#111C44] border border-white/5 rounded-2xl p-4 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        {student.FullName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{student.FullName}</h3>
                                        <p className="text-gray-400 text-xs">{student.StudentID}</p>
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={14} className="text-blue-400" />
                                    <span>{student.Course}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-purple-400" />
                                    <span>Batch: {student.Batch}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-green-400" />
                                    <span>Attendance: {student.AttendancePct}%</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className={`px-2 py-1 rounded text-xs ${student.FeesStatus === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {student.FeesStatus}
                                </span>
                                <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${student.ProgressPct}%` }}
                                    ></div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400">
                        No students found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsList;
