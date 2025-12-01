export const seedTestBatches = () => {
    window.__TEST_BATCHES = [
        { BatchCode: 'TEST_B1', CourseName: 'React Development' },
        { BatchCode: 'TEST_B2', CourseName: 'Python Data Science' },
        { BatchCode: 'TEST_B3', CourseName: 'Digital Marketing' }
    ];
    console.log("Seeded window.__TEST_BATCHES. You can now use this for UI testing if the API is down.");
};
