import React from 'react';
import { useData } from '../context/DataContext';
import { Layers, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const BatchesView = () => {
    const { batches, loading } = useData();

    if (loading) return <div className="text-white p-8">Loading batches...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Active Batches</h1>
                <p className="text-gray-400 text-sm">Overview of all running batches</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#111C44] border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                                <Layers size={24} />
                            </div>
                            <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-medium">Active</span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{batch.BatchCode}</h3>
                        <p className="text-gray-400 text-sm mb-4">{batch.CourseName}</p>

                        <div className="space-y-2 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                <Calendar size={16} className="text-purple-400" />
                                <span>Started: {batch.StartDate}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                <Users size={16} className="text-orange-400" />
                                <span>Students: --</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BatchesView;
