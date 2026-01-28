/**
 * App Controller
 */

// Global state for easy access in console/events
window.currentData = [];

document.addEventListener('DOMContentLoaded', () => {

    const { dropzone, fileInput, resetBtn, tableSearch } = UI.elements;

    // Drag & Drop Events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('bg-white/10', 'scale-105');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-white/10', 'scale-105');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('bg-white/10', 'scale-105');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File Input Event
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Reset Event
    resetBtn.addEventListener('click', () => {
        UI.reset();
        window.currentData = [];
    });

    // Search Event
    const searchInput = document.getElementById('table-search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (!term) {
            UI.renderTable(window.currentData);
            return;
        }

        const filtered = window.currentData.filter(item => {
            const u = item.member?.username || '';
            const id = item.id || '';
            return u.toLowerCase().includes(term) || id.includes(term);
        });

        // Pass page 1 always when searching
        UI.renderTable(filtered, 1);
    });
});

function handleFile(file) {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        UI.showError('Please upload a valid JSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            // Basic validation
            if (!Array.isArray(data)) {
                throw new Error("JSON must be an array of objects");
            }

            console.log("Data loaded", data.length, "items");

            // Store globally for filtering/sorting
            window.currentData = data;

            // Process
            const stats = Analytics.process(data);

            // Show UI
            UI.showDashboard(stats, data);

        } catch (err) {
            console.error(err);
            UI.showError('Error parsing JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}
