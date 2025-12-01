import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit, Trash2, X, Clock } from 'lucide-react';
import BatchTimeModal from '../components/BatchTimeModal';

const BatchesAdmin = () => {
    const { batches, courses } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [timeEditBatch, setTimeEditBatch] = useState(null);

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Batch Management</h1>
                    <p className="text-gray-400 text-sm">Create and manage student batches</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} />
                    <span>Create Batch</span>
                </button>
            </div>

            <div className="bg-[#111C44] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Batch Code</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Schedule</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {batches.map((batch, index) => (
                            <tr key={index} className="text-gray-300 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{batch.BatchCode}</td>
                                <td className="p-4">{batch.CourseName}</td>
                                <td className="p-4">
                                    {batch.StartTime && batch.EndTime ? (
                                        <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20 w-fit">
                                            <Clock size={12} />
                                            {batch.StartTime} - {batch.EndTime}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 text-xs italic">Not set</span>
                                    )}
                                </td>
                                <td className="p-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => setTimeEditBatch(batch)}
                                        className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                                        title="Edit Schedule"
                                    >
                                        <Clock size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Placeholder for Create */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#111C44] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Create New Batch</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <input placeholder="Batch Code (e.g. B3)" className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white" />
                            <select className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white">
                                <option>Select Course</option>
                                {courses.map((c, i) => <option key={i} value={c.CourseName}>{c.CourseName}</option>)}
                            </select>
                            <input type="date" className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white" />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Save Batch</button>
                    </div>
                </div>
            )}

            {/* Batch Time Editor Modal */}
            <BatchTimeModal
                isOpen={!!timeEditBatch}
                onClose={() => setTimeEditBatch(null)}
                batch={timeEditBatch}
            />
        </div>
    );
};

export default BatchesAdmin;
