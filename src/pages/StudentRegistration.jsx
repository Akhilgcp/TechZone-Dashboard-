import React, { useState } from 'react';
import { User, BookOpen, Calendar, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import '../Dashboard.css';

const StudentRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        batch: '',
        startDate: '',
        endDate: '',
        mobileNumber: '',
        city: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [message, setMessage] = useState('');

    // IMPORTANT: Update this URL after deploying the Google Apps Script
    const API_URL = "https://script.google.com/macros/s/AKfycbyd5h-CD_QkkXOWXGLmK4wN9RH87ZFnDYnU_evZnuwgJikvOHwmC0Gp3OoZAKMB5nvKtw/exec";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Use 'no-cors' mode for Google Apps Script Web App
            // Note: In 'no-cors', we can't read the response body, so we assume success if no network error.
            // To get a real response, we'd need a proxy or CORS-enabled backend.
            // However, for this use case, we'll proceed with the fetch.

            await fetch(`${API_URL}?action=register`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            setStatus('success');
            setMessage('Registration Successful! Welcome to TechZone.');
            setFormData({ name: '', batch: '', startDate: '', endDate: '', mobileNumber: '', city: '' });
        } catch (error) {
            console.error("Registration Error:", error);
            setStatus('error');
            setMessage('Failed to register. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1437] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-[#111C44] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-3xl"></div>

                <div className="relative z-10 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Student Registration</h1>
                        <p className="text-blue-200 text-sm mt-2">Join the TechZone Community</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                            <p className="text-gray-400 mb-8">{message}</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                            >
                                Register Another Student
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Batch Code</label>
                                <div className="relative group">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <select
                                        name="batch"
                                        required
                                        className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none transition-all"
                                        value={formData.batch}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Batch</option>
                                        <option value="B001">B001 - React Native</option>
                                        <option value="B002">B002 - Full Stack</option>
                                        <option value="B003">B003 - Data Science</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        required
                                        className="w-full bg-[#0B1437] border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        className="w-full bg-[#0B1437] border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Mobile Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="tel"
                                        name="mobileNumber"
                                        required
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">City</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        placeholder="Hyderabad"
                                        className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3.5 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
                                        value={formData.city}
                                        onChange={handleChange}
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
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
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
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentRegistration;
