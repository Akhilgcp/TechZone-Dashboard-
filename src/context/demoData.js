export const DEMO_DATA = {
    students: [
        { StudentID: "TZ001", Name: "Demo Student 1", Batch: "B1", Course: "Full Stack", Progress: 75, FeesStatus: "Paid" },
        { StudentID: "TZ002", Name: "Demo Student 2", Batch: "B1", Course: "Full Stack", Progress: 45, FeesStatus: "Pending" },
        { StudentID: "TZ003", Name: "Demo Student 3", Batch: "B2", Course: "Data Science", Progress: 90, FeesStatus: "Paid" },
    ],
    courses: [
        { CourseName: "Full Stack Development", Duration: "6 Months", Fees: 50000 },
        { CourseName: "Data Science", Duration: "8 Months", Fees: 75000 },
    ],
    batches: [
        { BatchCode: "B1", CourseName: "Full Stack Development", StartDate: "2024-01-01" },
        { BatchCode: "B2", CourseName: "Data Science", StartDate: "2024-02-01" },
    ],
    attendance: [
        { Name: "Demo Student 1", Date: "2024-03-01", Status: "Present" },
        { Name: "Demo Student 2", Date: "2024-03-01", Status: "Absent" },
    ]
};
