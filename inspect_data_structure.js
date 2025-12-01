import axios from 'axios';

const API_BASE = "https://script.google.com/macros/s/AKfycbxB86bLmSJsUmeYAgUdfln4bboq96NNWzOFujOj_yN4Aw70jDQ_NhG6hvQTYx17LY0uLw/exec";

async function inspectData() {
    console.log("Fetching data for inspection...");
    try {
        const [studentsRes, coursesRes, batchesRes] = await Promise.all([
            axios.get(`${API_BASE}?action=students`),
            axios.get(`${API_BASE}?action=courses`),
            axios.get(`${API_BASE}?action=batches`)
        ]);

        const getFirst = (res) => {
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            return data.length > 0 ? data[0] : "NO DATA";
        };

        console.log("\n--- STUDENT SAMPLE ---");
        console.log(JSON.stringify(getFirst(studentsRes), null, 2));

        console.log("\n--- COURSE SAMPLE ---");
        console.log(JSON.stringify(getFirst(coursesRes), null, 2));

        console.log("\n--- BATCH SAMPLE ---");
        console.log(JSON.stringify(getFirst(batchesRes), null, 2));

    } catch (err) {
        console.error("Error fetching data:", err.message);
    }
}

inspectData();
