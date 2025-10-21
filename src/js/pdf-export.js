// This file provides functionality for exporting patient data and reports to PDF format.

function exportToPDF(data) {
    const { jsPDF } = window.jspdf; // Ensure jsPDF is included in your project
    const doc = new jsPDF();

    // Set document title
    doc.setFontSize(22);
    doc.text("Hospital Discharge Report", 14, 22);

    // Add patient data
    doc.setFontSize(16);
    doc.text("Patient Data:", 14, 40);
    doc.setFontSize(12);
    Object.keys(data).forEach((key, index) => {
        doc.text(`${key}: ${data[key]}`, 14, 50 + (index * 10));
    });

    // Save the PDF
    doc.save("discharge_report.pdf");
}

// Example usage
document.getElementById("export-pdf-button").addEventListener("click", () => {
    const patientData = {
        nomePaciente: "John Doe",
        dataNascimento: "01/01/1990",
        prontuarioNum: "123456",
        cpf: "123.456.789-00",
        convenio: "Health Plan A",
        // Add other relevant data here
    };
    exportToPDF(patientData);
});