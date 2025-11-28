import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Filter, MoreVertical, X, User, BookOpen, Calendar, DollarSign, FileText } from 'lucide-react';
import '../Dashboard.css';

const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#111C44] border border-[rgba(255,255,255,0.1)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                            {student.FullName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{student.FullName}</h2>
                            <p className="text-gray-400">{student.StudentID} • {student.Course}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2 text-gray-400">
                            <BookOpen size={18} />
                            <span className="text-sm font-medium">Academic Info</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-400">Batch:</span> <span className="text-white">{student.Batch}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Trainer:</span> <span className="text-white">{student.Trainer}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Enrollment:</span> <span className="text-white">{student.EnrollmentDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Level:</span> <span className="text-white">{student.ProgressLevel}</span></div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2 text-gray-400">
                            <User size={18} />
                            <span className="text-sm font-medium">Personal Info</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span className="text-gray-400">Contact:</span> <span className="text-white">{student.Contact}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">City:</span> <span className="text-white">{student.City}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">Status:</span> <span className={`px-2 py-0.5 rounded text-xs ${student.FeesStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{student.FeesStatus}</span></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                        <div className="text-3xl font-bold text-blue-400 mb-1">{student.AttendancePct}%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Attendance</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{student.ProgressPct}%</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Progress</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                        <div className="text-3xl font-bold text-green-400 mb-1">A</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Grade</div>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-3 text-gray-400">
                        <FileText size={18} />
                        <span className="text-sm font-medium">Trainer Notes</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {student.Notes || "No notes available for this student."}
                    </p>
                </div>
            </div>
        </div>
    );
};

import SearchBar from '../components/SearchBar';

const Students = () => {
    const { students, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    if (loading) return <div className="p-8 text-white">Loading students data...</div>;

    // Defensive check
    if (!Array.isArray(students)) {
        return <div className="p-8 text-red-400">Error: Invalid students data.</div>;
    }

    const filteredStudents = students.filter(student => {
        if (!student) return false;
        const term = searchTerm.toLowerCase();
        return (
            (student.FullName && student.FullName.toLowerCase().includes(term)) ||
            (student.StudentID && student.StudentID.toLowerCase().includes(term)) ||
            (student.Course && student.Course.toLowerCase().includes(term))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Students Directory</h1>
                    <p className="text-gray-400 text-sm">Manage and view all registered students</p>
                </div>
                <div className="flex gap-3">
                    <SearchBar
                        placeholder="Search students..."
                        onSearch={setSearchTerm}
                    />
                    <button className="bg-[#111C44] border border-[rgba(255,255,255,0.1)] text-white p-2 rounded-xl hover:bg-white/5">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-[rgba(17,28,68,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[rgba(255,255,255,0.05)] text-gray-400 text-sm">
                                <th className="p-4 font-medium">Student</th>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Course</th>
                                <th className="p-4 font-medium">Batch</th>
                                <th className="p-4 font-medium">Attendance</th>
                                <th className="p-4 font-medium">Progress</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {filteredStudents.map((student, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[rgba(255,255,255,0.05)] hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                                {student.FullName ? student.FullName.charAt(0) : 'U'}
                                            </div>
                                            <span className="font-medium">{student.FullName || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{student.StudentID || 'N/A'}</td>
                                    <td className="p-4 text-sm">{student.Course || 'N/A'}</td>
                                    <td className="p-4 text-sm text-gray-400">{student.Batch || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${parseInt(student.AttendancePct || 0) >= 85 ? 'text-green-400' : parseInt(student.AttendancePct || 0) >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {student.AttendancePct || 0}%
                                            </span>
                                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt(student.AttendancePct || 0) >= 85 ? 'bg-green-500' : parseInt(student.AttendancePct || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${student.AttendancePct || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${student.ProgressPct || 0}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${student.FeesStatus === 'Paid' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {student.FeesStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        <MoreVertical size={18} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-gray-400">
                        No students found matching "{searchTerm}"
                    </div>
                )}
            </div>

            <StudentDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
};

export default Students;
