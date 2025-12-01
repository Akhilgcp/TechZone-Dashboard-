import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, BookOpen, CalendarCheck, Star, AlertCircle, Loader2, ChevronDown, CheckCircle } from 'lucide-react';
import { API_BASE } from '../config';
import { useData } from '../context/DataContext';

const AttendanceForm = () => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const { batches, refreshData } = useData();

    const onSubmit = async (data) => {
        setStatus('submitting');
        try {
            await fetch(`${API_BASE}?action=attendance`, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    batch: data.batch,
                    trainerRating: rating, // Use state rating
                    attendanceStatus: 'Present',
                    date: new Date().toISOString().split('T')[0]
                })
            });

            setStatus('success');
            setMessage('Attendance Marked Successfully!');
            reset({ rating: 5 });
            setRating(5);

            // Refresh data after successful attendance
            setTimeout(() => {
                setStatus('idle');
                refreshData();
            }, 3000);

        } catch (error) {
            console.error("Attendance Error:", error);
            setStatus('error');
            setMessage('Failed to mark attendance. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1437] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 mb-4 shadow-lg shadow-purple-500/30">
                            <CalendarCheck size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Daily Attendance</h1>
                        <p className="text-purple-200 text-sm mt-2">Mark your presence & rate session</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center py-10"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 animate-bounce-slow">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Attendance Marked!</h2>
                                <p className="text-gray-400">Thank you for your feedback.</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Your Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                        <input
                                            {...register("name", { required: "Name is required" })}
                                            placeholder="Enter your full name"
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all placeholder-gray-600"
                                        />
                                    </div>
                                    {errors.name && <span className="text-red-400 text-xs ml-1">{errors.name.message}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Select Batch</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                        <select
                                            {...register("batch", { required: "Batch is required" })}
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select your Batch</option>
                                            {batches.length === 0 ? (
                                                <option disabled>Loading batches...</option>
                                            ) : (
                                                batches
                                                    .sort((a, b) => a.BatchCode.localeCompare(b.BatchCode))
                                                    .map((b, i) => (
                                                        <option key={i} value={b.BatchCode}>
                                                            {b.BatchCode} - {b.CourseName}
                                                        </option>
                                                    ))
                                            )}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                    {errors.batch && <span className="text-red-400 text-xs ml-1">{errors.batch.message}</span>}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider block text-center">Rate Today's Session</label>
                                    <div className="flex items-center justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    size={36}
                                                    fill={star <= rating ? "#FFB547" : "none"}
                                                    color={star <= rating ? "#FFB547" : "#4B5563"}
                                                    className="transition-colors duration-200"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center text-sm font-medium text-purple-200">
                                        {rating === 5 ? "Excellent!" : rating === 4 ? "Good" : rating === 3 ? "Average" : "Needs Improvement"}
                                    </p>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-3 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                        <AlertCircle size={18} />
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Marking Present...
                                        </>
                                    ) : (
                                        'Mark Attendance'
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AttendanceForm;
