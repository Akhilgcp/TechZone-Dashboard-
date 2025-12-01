import axios from 'axios';

const API_URL = "https://script.google.com/macros/s/AKfycby0PDVMVgy4DQKvh0wOxqzQHUTK8lCnYltz6Sx4f2b8E9zL2Ds5xkf2JgW3QBEUROq8fg/exec";

async function debugAPI() {
    console.log("Fetching from:", API_URL);
    try {
        const response = await axios.get(`${API_URL}?action=students`, {
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 303; // Accept redirects to follow them manually if needed, though axios follows by default
            }
        });

        console.log("Status:", response.status);
        console.log("Headers:", response.headers);
        console.log("Data Type:", typeof response.data);
        console.log("Raw Data Preview:", JSON.stringify(response.data).substring(0, 500));

        if (response.data.data) {
            console.log("Has .data property. Length:", response.data.data.length);
        } else if (Array.isArray(response.data)) {
            console.log("Is Array. Length:", response.data.length);
        } else {
            console.log("Unknown structure keys:", Object.keys(response.data));
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.log("Error Response Data:", error.response.data);
        }
    }
}

debugAPI();
