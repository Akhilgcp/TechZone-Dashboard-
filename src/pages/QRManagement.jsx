import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Printer, Download, ExternalLink, UserPlus, CalendarCheck } from 'lucide-react';
import Card from '../components/Card';
import '../Dashboard.css';

const QRManagement = () => {
    // Use local IP for mobile testing
    const baseUrl = "http://192.168.0.113:5173";
    // const baseUrl = window.location.origin; // Revert to this for production
    const registrationUrl = `${baseUrl}/qr-registration`;
    const attendanceUrl = `${baseUrl}/qr-attendance`;

    const downloadQR = (id, name) => {
        const canvas = document.getElementById(id);
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${name}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">QR Code Management</h1>
                    <p className="text-gray-400 text-sm">Manage and distribute access codes for students</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration QR */}
                <Card className="p-0 overflow-hidden border-0 bg-gradient-to-b from-[#111C44] to-[#0B1437]">
                    <div className="p-6 bg-blue-600/10 border-b border-blue-500/20 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Student Registration</h2>
                            <p className="text-blue-200 text-sm">New student onboarding</p>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col items-center space-y-8">
                        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-blue-900/20 transform hover:scale-105 transition-transform duration-300">
                            <QRCodeCanvas
                                id="qr-reg"
                                value={registrationUrl}
                                size={220}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                            <button
                                onClick={() => downloadQR('qr-reg', 'TechZone_Registration_QR')}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                            >
                                <Download size={16} /> Download
                            </button>
                            <a
                                href={registrationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm border border-white/10"
                            >
                                <ExternalLink size={16} /> Open Link
                            </a>
                        </div>
                    </div>
                </Card>

                {/* Attendance QR */}
                <Card className="p-0 overflow-hidden border-0 bg-gradient-to-b from-[#111C44] to-[#0B1437]">
                    <div className="p-6 bg-purple-600/10 border-b border-purple-500/20 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <CalendarCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Daily Attendance</h2>
                            <p className="text-purple-200 text-sm">Check-in & Trainer Rating</p>
                        </div>
                    </div>

                    <div className="p-8 flex flex-col items-center space-y-8">
                        <div className="p-4 bg-white rounded-2xl shadow-xl shadow-purple-900/20 transform hover:scale-105 transition-transform duration-300">
                            <QRCodeCanvas
                                id="qr-att"
                                value={attendanceUrl}
                                size={220}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                            <button
                                onClick={() => downloadQR('qr-att', 'TechZone_Attendance_QR')}
                                className="bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                            >
                                <Download size={16} /> Download
                            </button>
                            <a
                                href={attendanceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm border border-white/10"
                            >
                                <ExternalLink size={16} /> Open Link
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default QRManagement;
