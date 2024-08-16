document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const homeButton = document.querySelector('.navbar-brand');
    const input = document.querySelector("#phone");

    // Fonction pour rafraîchir la page
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            location.reload();
        });
    }

    // Fonction pour mettre à jour les liens actifs
    const updateActiveLink = (links, currentId) => {
        links.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === currentId);
        });
    };

    // Fonction de défilement fluide
    const scrollToSection = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offset = document.querySelector('.navbar').offsetHeight;  // Offset pour la navbar sticky
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
            updateActiveLink(navLinks, targetId);
            updateActiveLink(dropdownItems, targetId);
        }
    };

    // Ajout d'événements de clic pour défilement fluide
    navLinks.forEach(link => link.addEventListener('click', scrollToSection));
    dropdownItems.forEach(item => item.addEventListener('click', scrollToSection));

    // Gestion du défilement de la fenêtre
    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 60;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        updateActiveLink(navLinks, currentSection);
        updateActiveLink(dropdownItems, currentSection);
    });

    // Observer pour les barres de progression
    const progressObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                if (bar.style.width !== targetWidth) {
                    bar.style.width = targetWidth;
                }
            }
        });
    }, { threshold: 0.1 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // Observer pour les éléments de la timeline
    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // Formulaire - intl-tel-input avec détection IP
    const iti = window.intlTelInput(input, {
        initialCountry: "auto", // Détection automatique du pays
        geoIpLookup: function(callback) {
            fetch('https://ipinfo.io?token=2ee5851481d61d') // Jeton d'API IPinfo
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.country ? data.country.toLowerCase() : "fr";
                    callback(countryCode);
                })
                .catch(() => {
                    callback("fr"); // Fallback sur la France en cas d'échec
                });
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
    });

    // Changer la longueur maximale du champ en fonction du pays sélectionné
    input.addEventListener("countrychange", function() {
        const maxLength = iti.getSelectedCountryData().maxNumberLength;
        input.maxLength = maxLength ? maxLength : 15; // Utilise 15 comme longueur maximale par défaut si aucune valeur spécifique n'est disponible
    });
});
