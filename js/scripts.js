document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const homeButton = document.querySelector('.navbar-brand');
    const input = document.querySelector("#phone");
    const form = document.querySelector('form');
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    var isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
    document.body.style.backgroundImage = 'url("../images/wallpaper.webp")';
    }

// Mode clair/sombre

    // Mode sombre initial
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleButton.classList.remove('bi-moon-stars-fill');
    toggleButton.classList.add('bi-sun-fill');
    toggleButton.textContent = '\u00A0'; // Remplacer le texte par un espace insécable
} else {
    toggleButton.textContent = '\u00A0'; // Remplacer le texte par un espace insécable
}

    // Gestion du clic sur le bouton
toggleButton.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const isDark = theme === 'dark';

    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    toggleButton.textContent = '\u00A0';

    // Changer l'icône selon le thème
    if (isDark) {
        toggleButton.classList.remove('bi-sun-fill');
        toggleButton.classList.add('bi-moon-stars-fill');
        toggleButton.setAttribute('aria-label', 'Passer en mode clair');
    } else {
        toggleButton.classList.remove('bi-moon-stars-fill');
        toggleButton.classList.add('bi-sun-fill');
        toggleButton.setAttribute('aria-label', 'Passer en mode sombre');
    }
});


// Rafraîchissement de la page au clic sur le bouton Accueil
    if (homeButton) {
        homeButton.addEventListener('click', () => location.reload());
    }

// Mettre à jour les liens actifs
    const updateActiveLink = (links, currentId) => {
        links.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === currentId);
        });
    };

// Défilement fluide vers les sections
    const scrollToSection = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = document.querySelector('.navbar').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
            updateActiveLink(navLinks, targetId);
            updateActiveLink(dropdownItems, targetId);
        }
    };

    navLinks.forEach(link => link.addEventListener('click', scrollToSection));
    dropdownItems.forEach(item => item.addEventListener('click', scrollToSection));

// Observer pour les sections visibles
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('progress-bar')) {
                    const bar = entry.target;
                    const targetWidth = bar.getAttribute('data-width');
                    bar.style.width = targetWidth;
                } else if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('in-view');
                }
            }
        });
    };

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    progressBars.forEach(bar => observer.observe(bar));
    timelineItems.forEach(item => observer.observe(item));

// Gestion du défilement de la fenêtre pour les sections
    const handleScroll = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 60;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        updateActiveLink(navLinks, currentSection);
        updateActiveLink(dropdownItems, currentSection);
    };

    window.addEventListener('scroll', handleScroll);

// Formulaire

    // Intl-Tel-Input Configuration
    const iti = window.intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup(callback) {
            fetch('https://ipinfo.io?token=2ee5851481d61d')
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.country ? data.country.toLowerCase() : "fr";
                    callback(countryCode);
                })
                .catch(() => {
                    callback("fr");
                });
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
    });

    // Mettre à jour la longueur maximale en fonction du pays sélectionné
    input.addEventListener("countrychange", () => {
        const maxLength = iti.getSelectedCountryData().maxNumberLength;
        input.maxLength = maxLength ? maxLength : 15;
    });

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', (event) => {
        const fullNumber = iti.getNumber();
        input.value = fullNumber;
    });
});
