import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_AUTH } from '../config';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ user: '', pass: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (credentials.user === DEMO_AUTH.user && credentials.pass === DEMO_AUTH.pass) {
            localStorage.setItem('tz_token', 'demo_token_valid');
            navigate('/');
        } else {
            setError('Invalid credentials. Try admin / demo123');
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1437] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-[#111C44] border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">TechZone Admin</h1>
                    <p className="text-gray-400 text-sm">Sign in to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={credentials.user}
                                onChange={e => setCredentials({ ...credentials, user: e.target.value })}
                                className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs uppercase font-bold tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={credentials.pass}
                                onChange={e => setCredentials({ ...credentials, pass: e.target.value })}
                                className="w-full bg-[#0B1437] border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                    >
                        Sign In <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs">
                        Demo Credentials: <span className="text-gray-300 font-mono">admin</span> / <span className="text-gray-300 font-mono">demo123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
