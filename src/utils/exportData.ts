import * as XLSX from 'xlsx';
import { FormData } from '../components/RegistrationPage';

export const exportToExcel = (data: FormData[], filename: string = 'electroblitz-registrations.xlsx') => {
    // Transform the data for Excel export
    const exportData = data.map((registration, index) => ({
        'S.No': index + 1,
        'First Name': registration.personalInfo.firstName,
        'Last Name': registration.personalInfo.lastName,
        'Email': registration.personalInfo.email,
        'Phone': registration.personalInfo.phone,
        'College': registration.personalInfo.college,
        'Academic Year': registration.personalInfo.year,
        'Category': registration.category,
        'Selected Events': registration.selectedEvents.join(', '),
        'Dietary Requirements': registration.additionalInfo.dietaryRequirements || 'None',
        'Accommodation Required': registration.additionalInfo.accommodation ? 'Yes' : 'No',
        'Emergency Contact': registration.additionalInfo.emergencyContact || 'Not provided',
        'Emergency Phone': registration.additionalInfo.emergencyPhone || 'Not provided',
        'Registration Date': new Date().toLocaleDateString()
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
        { wch: 5 },   // S.No
        { wch: 15 },  // First Name
        { wch: 15 },  // Last Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 30 },  // College
        { wch: 15 },  // Academic Year
        { wch: 15 },  // Category
        { wch: 40 },  // Selected Events
        { wch: 20 },  // Dietary Requirements
        { wch: 20 },  // Accommodation Required
        { wch: 20 },  // Emergency Contact
        { wch: 15 },  // Emergency Phone
        { wch: 15 }   // Registration Date
    ];
    worksheet['!cols'] = columnWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename);
};

export const exportCategoryToExcel = (
    data: FormData[],
    category: 'tech' | 'non-tech' | 'workshop',
    filename?: string
) => {
    const filtered = data.filter(r => r.category === category);
    const niceName = category === 'tech' ? 'technical' : category === 'non-tech' ? 'non-technical' : 'workshop';
    const outName = filename || `electroblitz-${niceName}-registrations.xlsx`;
    return exportToExcel(filtered, outName);
};

export const exportToCSV = (data: FormData[], filename: string = 'electroblitz-registrations.csv') => {
    // Transform the data for CSV export
    const exportData = data.map((registration, index) => ({
        'S.No': index + 1,
        'First Name': registration.personalInfo.firstName,
        'Last Name': registration.personalInfo.lastName,
        'Email': registration.personalInfo.email,
        'Phone': registration.personalInfo.phone,
        'College': registration.personalInfo.college,
        'Academic Year': registration.personalInfo.year,
        'Category': registration.category,
        'Selected Events': registration.selectedEvents.join(', '),
        'Dietary Requirements': registration.additionalInfo.dietaryRequirements || 'None',
        'Accommodation Required': registration.additionalInfo.accommodation ? 'Yes' : 'No',
        'Emergency Contact': registration.additionalInfo.emergencyContact || 'Not provided',
        'Emergency Phone': registration.additionalInfo.emergencyPhone || 'Not provided',
        'Registration Date': new Date().toLocaleDateString()
    }));

    // Convert to CSV
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData));

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportEventStatistics = (events: any[], filename: string = 'electroblitz-event-stats.xlsx') => {
    const statsData = events.map((event, index) => ({
        'Event ID': event.id,
        'Event Name': event.title,
        'Category': event.category,
        'Duration': event.duration,
        'Difficulty': event.difficulty,
        'Prize': event.prize,
        'Participants': event.participants || 0,
        'Registration Fee': event.fee || 'Free'
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(statsData);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 15 },  // Event ID
        { wch: 30 },  // Event Name
        { wch: 15 },  // Category
        { wch: 15 },  // Duration
        { wch: 15 },  // Difficulty
        { wch: 15 },  // Prize
        { wch: 12 },  // Participants
        { wch: 15 }   // Registration Fee
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Statistics');
    XLSX.writeFile(workbook, filename);
};
