document.addEventListener('DOMContentLoaded', () => {
    // Code pour le mode clair/sombre
    const toggleSwitch = document.querySelector('#theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Rafraîchissement de la page au clic sur le bouton Accueil
    const homeButton = document.querySelector('.navbar-brand');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = '/';
            setTimeout(() => window.scrollTo(0, 0), 100);
        });
    }
});

