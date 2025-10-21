document.addEventListener("DOMContentLoaded", () => {
    const printButton = document.getElementById("print-button");
    const shareButton = document.getElementById("share-button");

    if (printButton) {
        printButton.addEventListener("click", () => {
            window.print();
        });
    }

    if (shareButton) {
        shareButton.addEventListener("click", () => {
            const reportContent = document.getElementById("report-content").innerHTML;
            const blob = new Blob([reportContent], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "discharge_report.html";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});