import axios from 'axios';

const API_URL = "https://script.google.com/macros/s/AKfycby0PDVMVgy4DQKvh0wOxqzQHUTK8lCnYltz6Sx4f2b8E9zL2Ds5xkf2JgW3QBEUROq8fg/exec";

async function probe() {
    console.log("Probing API...");

    const tests = [
        { method: 'GET', params: { action: 'students' }, label: 'GET ?action=students' },
        { method: 'GET', params: { type: 'students' }, label: 'GET ?type=students' },
        { method: 'GET', params: { sheet: 'Students' }, label: 'GET ?sheet=Students' },
        { method: 'GET', params: { route: 'students' }, label: 'GET ?route=students' },
        { method: 'POST', data: { action: 'students' }, label: 'POST {action: students}' },
        { method: 'POST', data: JSON.stringify({ action: 'students' }), label: 'POST stringified {action: students}' },
    ];

    for (const test of tests) {
        try {
            console.log(`\n--- Testing ${test.label} ---`);
            const config = {
                method: test.method,
                url: API_URL,
                params: test.method === 'GET' ? test.params : undefined,
                data: test.method === 'POST' ? test.data : undefined,
                maxRedirects: 5
            };

            if (test.method === 'POST') {
                config.headers = { 'Content-Type': 'application/json' };
            }

            const res = await axios(config);
            console.log("Status:", res.status);
            const preview = JSON.stringify(res.data).substring(0, 100);
            console.log("Response:", preview);

            if (preview.includes("App Script is alive")) {
                console.log("Result: DEFAULT RESPONSE (Failed to route)");
            } else if (Array.isArray(res.data) || res.data.data) {
                console.log("Result: SUCCESS (Data found!)");
            } else {
                console.log("Result: UNKNOWN RESPONSE");
            }

        } catch (err) {
            console.log("Error:", err.message);
        }
    }
}

probe();
