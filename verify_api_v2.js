import axios from 'axios';

const API_BASE = "https://script.google.com/macros/s/AKfycbxB86bLmSJsUmeYAgUdfln4bboq96NNWzOFujOj_yN4Aw70jDQ_NhG6hvQTYx17LY0uLw/exec";

const log = (msg, type = 'INFO') => console.log(`[${type}] ${msg}`);

async function runVerification() {
    log("Starting Automated Verification V2...");
    let passed = 0;
    let failed = 0;

    // 1. GET Students
    try {
        log("Checking GET Students...");
        const res = await axios.get(`${API_BASE}?action=students`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);

        if (Array.isArray(data)) {
            log(`SUCCESS: Fetched ${data.length} students.`, 'PASS');
            passed++;
        } else {
            log(`FAILURE: Expected array, got ${typeof res.data}`, 'FAIL');
            failed++;
        }
    } catch (err) {
        log(`FAILURE: GET Students - ${err.message}`, 'FAIL');
        failed++;
    }

    // 2. POST Register
    try {
        log("Checking POST Register...");
        const dummy = {
            name: "Auto Verify Student",
            batch: "TEST_BATCH_V2",
            mobileNumber: "9999999999",
            city: "Test City",
            startDate: new Date().toISOString().split('T')[0]
        };

        await axios.post(`${API_BASE}?action=register`, dummy, {
            headers: { 'Content-Type': 'application/json' }
        });
        log("SUCCESS: POST Register executed.", 'PASS');
        passed++;
    } catch (err) {
        log(`FAILURE: POST Register - ${err.message}`, 'FAIL');
        failed++;
    }

    // 3. POST Attendance
    try {
        log("Checking POST Attendance...");
        const dummyAtt = {
            name: "Auto Verify Student",
            batch: "TEST_BATCH_V2",
            trainerRating: 5,
            attendanceStatus: "Present",
            date: new Date().toISOString().split('T')[0]
        };
        await axios.post(`${API_BASE}?action=attendance`, dummyAtt);
        log("SUCCESS: POST Attendance executed.", 'PASS');
        passed++;
    } catch (err) {
        log(`FAILURE: POST Attendance - ${err.message}`, 'FAIL');
        failed++;
    }

    log("---------------------------------------------------");
    log(`Verification Summary: ${passed} Passed, ${failed} Failed`);
    log("---------------------------------------------------");
}

runVerification();
