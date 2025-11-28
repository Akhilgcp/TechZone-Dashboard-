import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { BookOpen, Clock, DollarSign, Users, BarChart } from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Courses = () => {
    const { courses, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="p-8 text-white">Loading courses data...</div>;

    const filteredCourses = courses.filter(course =>
        course.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.CourseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Courses Directory</h1>
                    <p className="text-gray-400 text-sm">Explore available training programs</p>
                </div>
                <SearchBar
                    placeholder="Search courses..."
                    onSearch={setSearchTerm}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                    <div key={index} className="bg-[#111C44]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${course.DifficultyLevel === 'Advanced' ? 'bg-red-500/20 text-red-400' : course.DifficultyLevel === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                {course.DifficultyLevel}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.CourseName}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.SyllabusOverview}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Clock size={16} className="text-blue-400" />
                                <span>{course.Duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <DollarSign size={16} className="text-green-400" />
                                <span>₹{course.Fees}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <Users size={16} className="text-purple-400" />
                                <span>{course.ActiveBatches} Batches</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 text-sm">
                                <BarChart size={16} className="text-yellow-400" />
                                <span>{course.TotalHours} Hrs</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs text-gray-500">Code: {course.CourseCode}</span>
                            <button className="text-sm font-medium text-blue-400 hover:text-blue-300">View Details →</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
