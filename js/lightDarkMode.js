document.addEventListener('DOMContentLoaded', function() {
    const lightButton = document.querySelector('.btn-light');
    const darkButton = document.querySelector('.btn-dark');
    const body = document.body;

    lightButton.addEventListener('click', function() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    });

    darkButton.addEventListener('click', function() {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    });
});