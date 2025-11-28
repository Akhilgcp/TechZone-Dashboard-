import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Calendar, Users, Clock, MapPin, User } from 'lucide-react';
import '../Dashboard.css';

const Batches = () => {
    const { batches, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="p-8 text-white">Loading batches data...</div>;

    const filteredBatches = batches.filter(batch =>
        batch.BatchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.TrainerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Batches Management</h1>
                    <p className="text-gray-400 text-sm">Track ongoing and upcoming batches</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search batches..."
                        className="bg-[#111C44] border border-[rgba(255,255,255,0.1)] text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBatches.map((batch, index) => (
                    <div key={index} className="bg-[#111C44]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{batch.BatchCode}</h3>
                                <p className="text-blue-400 font-medium">{batch.CourseName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.BatchStatus === 'Ongoing' ? 'bg-green-500/20 text-green-400' : batch.BatchStatus === 'Completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {batch.BatchStatus}
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar size={16} />
                                    <span>Duration</span>
                                </div>
                                <span className="text-white">{batch.StartDate} - {batch.EndDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={16} />
                                    <span>Timing</span>
                                </div>
                                <span className="text-white">{batch.BatchTiming}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User size={16} />
                                    <span>Trainer</span>
                                </div>
                                <span className="text-white">{batch.TrainerName}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPin size={16} />
                                    <span>Classroom</span>
                                </div>
                                <span className="text-white">{batch.Classroom}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Total Students</p>
                                    <p className="text-lg font-bold text-white">{batch.TotalStudents}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Avg Attendance</p>
                                <p className="text-lg font-bold text-green-400">{batch.AverageAttendance}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Batches;
