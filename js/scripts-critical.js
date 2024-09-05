document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#theme-toggle');
    const rootElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';

    const setTheme = (theme) => {
        rootElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    if (currentTheme === 'dark') {
        setTheme('dark');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', () => {
        setTheme(toggleSwitch.checked ? 'dark' : 'light');
    });

    // Rafraîchir la page au clic sur le bouton Accueil
    const homeButton = document.querySelector('.navbar-brand');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = '/';
            setTimeout(() => window.scrollTo(0, 0), 100);
        });
    }
});
