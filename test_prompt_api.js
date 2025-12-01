import axios from 'axios';

const API_PROMPT = "https://script.google.com/macros/s/AKfycby0PDVMVgy4DQKvh0wOxqzQHUTK8lCnYltz6Sx4f2b8E9zL2Ds5xkf2JgW3QBEUROq8fg/exec";
const API_WORKING = "https://script.google.com/macros/s/AKfycbxB86bLmSJsUmeYAgUdfln4bboq96NNWzOFujOj_yN4Aw70jDQ_NhG6hvQTYx17LY0uLw/exec";

async function testAPIs() {
    console.log("Testing API from PROMPT:", API_PROMPT);
    try {
        const res = await axios.get(`${API_PROMPT}?action=students`);
        console.log("PROMPT API Status:", res.status);
        console.log("PROMPT API Data Preview:", JSON.stringify(res.data).substring(0, 100));
    } catch (err) {
        console.log("PROMPT API Failed:", err.message);
    }

    console.log("\nTesting API that WORKED previously:", API_WORKING);
    try {
        const res = await axios.get(`${API_WORKING}?action=students`);
        console.log("WORKING API Status:", res.status);
        console.log("WORKING API Data Preview:", JSON.stringify(res.data).substring(0, 100));
    } catch (err) {
        console.log("WORKING API Failed:", err.message);
    }
}

testAPIs();
