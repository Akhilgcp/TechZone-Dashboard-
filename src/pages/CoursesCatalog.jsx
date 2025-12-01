import React from 'react';
import { useData } from '../context/DataContext';
import { BookOpen, Clock, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const CoursesCatalog = () => {
    const { courses, loading } = useData();

    if (loading) return <div className="text-white p-8">Loading courses...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Course Catalog</h1>
                <p className="text-gray-400 text-sm">Explore our available technology programs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#111C44] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
                    >
                        <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-700 p-6 flex items-end relative overflow-hidden">
                            <BookOpen className="text-white/20 absolute -right-4 -top-4 w-32 h-32 transform rotate-12" />
                            <h3 className="text-xl font-bold text-white relative z-10">{course.CourseName}</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Clock size={18} className="text-blue-400" />
                                <span>{course.Duration}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <DollarSign size={18} className="text-green-400" />
                                <span>₹{Number(course.Fees).toLocaleString()}</span>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <Award size={18} />
                                    <span>View Syllabus</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CoursesCatalog;
