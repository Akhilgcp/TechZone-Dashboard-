import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Save, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config';
import { useData } from '../context/DataContext';

const BatchTimeModal = ({ isOpen, onClose, batch }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const { refreshData } = useData();

    useEffect(() => {
        if (batch) {
            setStartTime(batch.StartTime || '');
            setEndTime(batch.EndTime || '');
            setStatus('idle');
            setError('');
        }
    }, [batch, isOpen]);

    const handleSave = async () => {
        if (!startTime || !endTime) {
            setError('Both Start Time and End Time are required.');
            return;
        }

        setStatus('saving');
        setError('');

        try {
            const response = await fetch(`${API_BASE}?action=set_batch_times`, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script limitation
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'set_batch_times',
                    batchCode: batch.BatchCode,
                    startTime,
                    endTime,
                    tzLabel: 'IST' // Defaulting to IST for now
                })
            });

            // Since no-cors returns opaque response, we assume success if no network error
            // Ideally we'd want a real response, but with GAS web app + no-cors, we can't read it.
            // We'll simulate a delay and then refresh.

            setTimeout(() => {
                setStatus('success');
                refreshData();
                setTimeout(() => {
                    onClose();
                }, 1000);
            }, 1500);

        } catch (err) {
            console.error("Save Error:", err);
            setStatus('error');
            setError('Failed to save times. Please check connection.');
        }
    };

    if (!isOpen || !batch) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#111C44] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-400" />
                            Edit Schedule: {batch.BatchCode}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-[#0B1437] border border-white/10 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-[#0B1437] border border-white/10 text-white px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={status === 'saving' || status === 'success'}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${status === 'success'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                    }`}
                            >
                                {status === 'saving' ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : status === 'success' ? (
                                    'Saved!'
                                ) : (
                                    <>
                                        <Save size={18} /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BatchTimeModal;
