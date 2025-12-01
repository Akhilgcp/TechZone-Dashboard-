import axios from 'axios';
import { API_BASE } from './src/config.js';

const log = (msg, type = 'INFO') => console.log(`[${type}] ${msg}`);

async function runSanityChecks() {
    log("Starting Sanity Checks...");
    let passed = 0;
    let failed = 0;

    // A) GET Students
    try {
        log("A) Checking GET Students...");
        const res = await axios.get(`${API_BASE}?action=students`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);

        if (Array.isArray(data)) {
            log(`PASS: Fetched ${data.length} students. Sample: ${JSON.stringify(data[0] || {})}`, 'PASS');
            passed++;
        } else {
            log(`FAIL: Expected array, got ${typeof res.data}`, 'FAIL');
            failed++;
        }
    } catch (err) {
        log(`FAIL: GET Students - ${err.message}`, 'FAIL');
        failed++;
    }

    // B) POST Register
    try {
        log("B) Checking POST Register...");
        const dummy = {
            name: "Antigravity Test",
            batch: "TEST_B",
            startDate: "2025-01-01",
            mobileNumber: "000",
            city: "Test"
        };

        await axios.post(`${API_BASE}?action=register`, dummy, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Verify appended
        const res = await axios.get(`${API_BASE}?action=students`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const found = data.find(s => s.Name === "Antigravity Test" && s.Batch === "TEST_B");

        if (found) {
            log("PASS: Student registered and verified.", 'PASS');
            passed++;
        } else {
            log("FAIL: Student registered but not found in subsequent fetch (might be delay or failure).", 'FAIL');
            // Note: GAS might have delay, but we'll count as fail for strict check or warn.
            // For now, let's assume if no error on POST, it's partial pass, but finding it is full pass.
            failed++;
        }
    } catch (err) {
        log(`FAIL: POST Register - ${err.message}`, 'FAIL');
        failed++;
    }

    // C) POST Attendance
    try {
        log("C) Checking POST Attendance...");
        const dummyAtt = {
            name: "Antigravity Test",
            batch: "TEST_B",
            trainerRating: 5,
            attendanceStatus: "Present",
            date: new Date().toISOString().split('T')[0]
        };
        await axios.post(`${API_BASE}?action=attendance`, dummyAtt);

        // Verify appended
        const res = await axios.get(`${API_BASE}?action=attendance`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        const found = data.find(a => a.Name === "Antigravity Test" && Number(a.TrainerRating) === 5);

        if (found) {
            log("PASS: Attendance marked and verified.", 'PASS');
            passed++;
        } else {
            log("FAIL: Attendance marked but not found in subsequent fetch.", 'FAIL');
            failed++;
        }
    } catch (err) {
        log(`FAIL: POST Attendance - ${err.message}`, 'FAIL');
        failed++;
    }

    // D & E are UI checks, we simulate or log instructions
    log("D) UI Check: Verify HeaderLogout renders and clears token. (Manual Check Required)", 'INFO');
    log("E) UI Check: Verify Batch Select populates. (Manual Check Required)", 'INFO');

    log("---------------------------------------------------");
    log(`Sanity Check Summary: ${passed} Passed, ${failed} Failed`);
    log("---------------------------------------------------");
}

runSanityChecks();
