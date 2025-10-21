document.addEventListener("DOMContentLoaded", () => {
    const pages = [
        "index.html",
        "patient-data.html",
        "clinical-history.html",
        "surgical-planning.html",
        "surgical-checklist.html",
        "who-safe-surgery-checklist.html",
        "rpa-recovery.html",
        "safe-transfer-room.html",
        "room-312a-safety-protocol.html",
        "automatic-notification.html",
        "discharge-report.html",
        "finalize.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    const nextButton = document.getElementById("next-button");
    const backButton = document.getElementById("back-button");

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            const currentIndex = pages.indexOf(currentPage);
            if (currentIndex < pages.length - 1) {
                window.location.href = pages[currentIndex + 1];
            }
        });
    }

    if (backButton) {
        backButton.addEventListener("click", () => {
            const currentIndex = pages.indexOf(currentPage);
            if (currentIndex > 0) {
                window.location.href = pages[currentIndex - 1];
            }
        });
    }

    const updateUI = () => {
        // Example of dynamic UI updates based on the current page
        const titleElement = document.getElementById("page-title");
        if (titleElement) {
            titleElement.textContent = currentPage.replace(/-/g, ' ').replace('.html', '').toUpperCase();
        }
    };

    updateUI();
});