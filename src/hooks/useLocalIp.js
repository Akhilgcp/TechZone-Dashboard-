import { useState, useEffect } from 'react';

const useLocalIp = () => {
    const [localIp, setLocalIp] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const detectIp = async () => {
            try {
                const ip = await new Promise((resolve, reject) => {
                    const pc = new RTCPeerConnection({ iceServers: [] });
                    pc.createDataChannel('');
                    pc.createOffer().then(offer => pc.setLocalDescription(offer));

                    pc.onicecandidate = (ice) => {
                        if (ice && ice.candidate && ice.candidate.candidate) {
                            const result = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
                            if (result && result[1]) {
                                pc.close();
                                resolve(result[1]);
                            }
                        }
                    };

                    setTimeout(() => {
                        pc.close();
                        reject(new Error("Timeout detecting IP"));
                    }, 1000);
                });
                setLocalIp(ip);
            } catch (err) {
                console.warn("Local IP detection failed:", err);
                setError(err);
                setLocalIp('192.168.0.115'); // Fallback to the known IP from prompt
            }
        };

        detectIp();
    }, []);

    return { localIp, error };
};

export default useLocalIp;
