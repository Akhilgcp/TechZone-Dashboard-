import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const CoursesAdmin = () => {
    const { courses } = useData();
    const [isEditing, setIsEditing] = useState(false);

    // Placeholder for form handling - just UI for now as per "fix it" request
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Courses Administration</h1>
                    <p className="text-gray-400 text-sm">Manage course details, fees, and duration</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} />
                    <span>Add New Course</span>
                </button>
            </div>

            <div className="bg-[#111C44] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Course Name</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Fees</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {courses.map((course, index) => (
                            <tr key={index} className="text-gray-300 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{course.CourseName}</td>
                                <td className="p-4">{course.Duration}</td>
                                <td className="p-4">₹{Number(course.Fees).toLocaleString()}</td>
                                <td className="p-4 flex justify-end gap-2">
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

            {/* Simple Modal Placeholder */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#111C44] border border-white/10 p-6 rounded-2xl w-full max-w-md space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Add/Edit Course</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <input placeholder="Course Name" className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white" />
                            <input placeholder="Duration (e.g. 6 Months)" className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white" />
                            <input placeholder="Fees" type="number" className="w-full bg-[#0B1437] border border-white/10 p-3 rounded-xl text-white" />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Save Course</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursesAdmin;
