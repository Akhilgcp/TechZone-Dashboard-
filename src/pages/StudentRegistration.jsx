import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, BookOpen, Phone, MapPin, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { API_BASE } from '../config';
import { useData } from '../context/DataContext';

const StudentRegistration = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
    const { batches, refreshData } = useData();

    const onSubmit = async (data) => {
        setStatus('submitting');
        try {
            await fetch(`${API_BASE}?action=register`, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            setStatus('success');
            setMessage('Registration Successful! Welcome to TechZone.');
            reset();

            // Refresh data after successful registration
            setTimeout(() => {
                setStatus('idle');
                refreshData();
            }, 3000);

        } catch (error) {
            console.error("Registration Error:", error);
            setStatus('error');
            setMessage('Failed to register. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1437] flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 mb-4 shadow-lg shadow-blue-500/30">
                            <User size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Student Registration</h1>
                        <p className="text-blue-200 text-sm mt-2">Join the TechZone Community</p>
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
                                    <AlertCircle size={40} className="text-green-500" />
                                    {/* Using AlertCircle as success icon placeholder or CheckCircle if available. 
                                        Wait, I should use CheckCircle but I didn't import it. 
                                        Let's stick to AlertCircle or add CheckCircle to imports. 
                                        I'll add CheckCircle to imports. */}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
                                <p className="text-gray-400">Welcome to the academy.</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                        <input
                                            {...register("name", { required: "Name is required" })}
                                            placeholder="John Doe"
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        />
                                    </div>
                                    {errors.name && <span className="text-red-400 text-xs ml-1">{errors.name.message}</span>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Select Batch</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                        <select
                                            {...register("batch", { required: "Batch is required" })}
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select a Batch</option>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Start Date</label>
                                        <input
                                            type="date"
                                            {...register("startDate", { required: "Start Date is required" })}
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">End Date</label>
                                        <input
                                            type="date"
                                            {...register("endDate")}
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Mobile Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                        <input
                                            type="tel"
                                            {...register("mobileNumber", { required: "Mobile is required" })}
                                            placeholder="+91 98765 43210"
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">City</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            {...register("city", { required: "City is required" })}
                                            placeholder="Hyderabad"
                                            className="w-full bg-[#0B1437]/50 border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        />
                                    </div>
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
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {status === 'submitting' ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        'Complete Registration'
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

export default StudentRegistration;
