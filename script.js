// Minimal JavaScript functionality for Hugo's prototype site

// Set footer copyright year dynamically on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Console log friendly message
    console.log('Apollo says hello, Hugo!');
});