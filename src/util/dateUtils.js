export const normalizeDate = (dateInput) => {
    if (!dateInput) return null;

    // Handle Excel Serial Number
    if (typeof dateInput === 'number') {
        const date = new Date(Math.round((dateInput - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    }

    // Handle String
    if (typeof dateInput === 'string') {
        // Try to parse standard formats
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
    }

    return dateInput; // Return as is if parsing fails
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
};
