# TechZone Academy Dashboard

A modern, automated dashboard for TechZone Academy, integrated with Google Apps Script for live data management.

## Features
- **Live Data**: Fetches Students, Attendance, Courses, and Batches from Google Sheets via Apps Script.
- **Admin Authentication**: Secure login with demo credentials (configurable).
- **QR Management**: Generates universal QR codes for Student Registration and Daily Attendance (High-Res Download/Print).
- **Admin Controls**: CRUD operations for Courses and Batches.
- **Automated Reporting**: Visualizes attendance trends, batch performance, and live interns.
- **Real-Time Notifications**: Polling-based alerts for new attendance.
- **Mobile-First**: Fully responsive design for use on tablets and phones.
- **Debug Panel**: Built-in tool to test API connectivity and force refreshes.

## Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configuration**
    - The API URL is configured in `src/config.js`.
    - **Demo Credentials**: `admin` / `demo123` (Change in `src/config.js`).
    - You can also override the API URL in the **Settings** page of the dashboard.

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    - To access on mobile (same WiFi), use the Network IP shown in the terminal (e.g., `http://192.168.1.x:5173`).

4.  **Build for Production**
    ```bash
    npm run build
    ```
    - The output will be in the `dist` folder.

## Deployment

### Vercel / Netlify
1.  Push this repository to GitHub.
2.  Import the project into Vercel or Netlify.
3.  Set the Build Command to `npm run build`.
4.  Set the Output Directory to `dist`.
5.  Deploy!

## QR Codes
- Go to the **QR Management** page.
- Download the "Student Registration" and "Daily Attendance" QR codes.
- Print and display them at the academy.
- Students can scan to register or mark attendance.

## Troubleshooting
- **White Screen?** Restart the dev server (`Ctrl+C` then `npm run dev`).
- **Data not loading?** Check the API URL in Settings or `src/config.js`. Ensure the Google Apps Script is deployed as a Web App with access set to "Anyone".
- **Debug Mode**: Add `?debug=true` to the URL (e.g., `http://localhost:5177/dashboard?debug=true`) to open the developer console overlay.

## API Integration
The dashboard connects to a Google Apps Script Web App.
- **GET**: `?action=students`, `?action=attendance`, `?action=courses`, `?action=batches`
- **POST**: `?action=register`, `?action=attendance`, `?action=courses.create`, etc.
- **Note**: POST requests use `mode: 'no-cors'` due to browser restrictions with Google Apps Script. Success is assumed if no network error occurs.

## Real-Time Notifications
Currently uses polling (every 30s). To upgrade to true real-time:
1.  Implement Firebase or WebSocket in `src/hooks/useNotifications.js`.
2.  Update `src/config.js` to enable the new provider.
