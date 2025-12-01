import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, UserPlus, CalendarCheck, Wifi, Copy, Printer, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import { BASE_URL, STORAGE_KEYS } from '../config';
import useLocalIp from '../hooks/useLocalIp';
import '../Dashboard.css';

const QRManagement = () => {
    const { localIp } = useLocalIp();
    const [lanIp, setLanIp] = useState(() => localStorage.getItem(STORAGE_KEYS.LAN_OVERRIDE) || localIp || '192.168.0.115');
    const [manualIp, setManualIp] = useState(lanIp);
    const [showValidation, setShowValidation] = useState(false);

    useEffect(() => {
        if (localIp && !localStorage.getItem(STORAGE_KEYS.LAN_OVERRIDE)) {
            setLanIp(localIp);
            setManualIp(localIp);
        }
    }, [localIp]);

    const handleSaveIp = () => {
        setLanIp(manualIp);
        localStorage.setItem(STORAGE_KEYS.LAN_OVERRIDE, manualIp);
    };

    const handleUseDetected = () => {
        if (localIp) {
            setManualIp(localIp);
            setLanIp(localIp);
            localStorage.setItem(STORAGE_KEYS.LAN_OVERRIDE, localIp);
        }
    };

    const getUrl = (path, useLan = false) => {
        const base = useLan ? `http://${lanIp}:5173` : BASE_URL;
        return `${base}/#${path}`;
    };

    const downloadQR = (id, name) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const highResCanvas = document.createElement('canvas');
        const scale = 8;
        highResCanvas.width = canvas.width * scale;
        highResCanvas.height = canvas.height * scale;
        const ctx = highResCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, highResCanvas.width, highResCanvas.height);
        const pngUrl = highResCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const QRSection = ({ title, icon: Icon, color, path, idSuffix }) => {
        const primaryUrl = getUrl(path, false);
        const lanUrl = getUrl(path, true);

        return (
            <Card className="p-0 overflow-hidden border-0 bg-gradient-to-b from-[#111C44] to-[#0B1437]">
                <div className={`p-6 bg-${color}-600/10 border-b border-${color}-500/20 flex items-center gap-4`}>
                    <div className={`p-3 bg-${color}-500/20 rounded-xl text-${color}-400`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <p className={`text-${color}-200 text-sm`}>Scan to access</p>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* LAN QR */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">LAN / Wi-Fi Access</span>
                        <div className={`p-4 bg-white rounded-2xl shadow-xl shadow-${color}-900/20 transform hover:scale-105 transition-transform duration-300`}>
                            <QRCodeCanvas
                                id={`qr-lan-${idSuffix}`}
                                value={lanUrl}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <code className="text-[10px] text-gray-400 bg-black/30 px-2 py-1 rounded">{lanUrl}</code>
                            <button onClick={() => copyToClipboard(lanUrl)} className="text-gray-400 hover:text-white"><Copy size={12} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => downloadQR(`qr-lan-${idSuffix}`, `TechZone_${title}_LAN`)}
                            className={`bg-${color}-600 hover:bg-${color}-500 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium`}
                        >
                            <Download size={16} /> PNG
                        </button>
                        <a
                            href={lanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border border-white/10"
                        >
                            <ExternalLink size={16} /> Open
                        </a>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">QR Code Management</h1>
                    <p className="text-gray-400 text-sm">Configure and generate access codes</p>
                </div>
            </div>

            {/* LAN Configuration */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Wifi size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">LAN Configuration</h3>
                        <p className="text-gray-400 text-sm">
                            Detected IP: <span className="text-white font-mono">{localIp || 'Detecting...'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs text-gray-400 mb-1.5 ml-1">LAN IP Address (Override)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={manualIp}
                                onChange={(e) => setManualIp(e.target.value)}
                                className="flex-1 bg-[#0B1437] border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                                placeholder="e.g. 192.168.0.115"
                            />
                            <button
                                onClick={handleSaveIp}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    {localIp && localIp !== manualIp && (
                        <button
                            onClick={handleUseDetected}
                            className="text-blue-400 text-sm hover:text-blue-300 underline pb-3"
                        >
                            Use Detected IP ({localIp})
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <QRSection
                    title="Student Registration"
                    icon={UserPlus}
                    color="blue"
                    path="/students/register"
                    idSuffix="reg"
                />
                <QRSection
                    title="Daily Attendance"
                    icon={CalendarCheck}
                    color="purple"
                    path="/attendance"
                    idSuffix="att"
                />
            </div>
        </div>
    );
};

export default QRManagement;
