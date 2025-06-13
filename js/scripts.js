document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const homeButton = document.querySelector('.navbar-brand');
    const input = document.querySelector("#phone");
    const form = document.querySelector('form');
    const toggleSwitch = document.querySelector('#theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Désactiver la restauration automatique du scroll
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Code pour le carousel Owl
    $(".carousel.owl-carousel").owlCarousel({
        margin: 10,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        dots: true,
        nav: false,
        navText: ['←', '→'],
        onInitialized: function(event) {
            $('.owl-dot').each(function(index) {
                $(this).attr('aria-label', 'Aller à la slide ' + (index + 1));
            });

            // Application des styles pour l'accessibilité après l'initialisation
            applyAccessibilityStyles();
        },
        onChanged: function(event) {
            // Réappliquer les styles d'accessibilité après chaque changement de slide
            applyAccessibilityStyles();
        },
        responsive: {
            0: {
                items: 1,
            },
            800: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
    });

    $(".custom-owl-next").click(function() {
        $(".carousel").trigger("next.owl.carousel");
    });

    $(".custom-owl-prev").click(function() {
        $(".carousel").trigger("prev.owl.carousel");
    });

    // Détecter si c'est un appareil tactile
    if ('ontouchstart' in document.documentElement) {
        document.body.classList.add('touch-device');
    }

    // Gestion des boutons "Voir les détails" pour portfolio, formation et expérience
    const viewLabelButtons = document.querySelectorAll('.view-label-btn');
    let activeButton = null;

    function toggleLabel(button, labelElement) {
        if (labelElement.style.display === 'block') {
            labelElement.style.display = 'none';
            button.textContent = 'Voir les détails';
            activeButton = null;
        } else {
            labelElement.style.display = 'block';
            button.textContent = 'Cacher les détails';
            activeButton = button;
        }
    }

    viewLabelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const parentElement = button.closest('.timeline-panel') || button.closest('.card');
            const labelElement = parentElement.querySelector('.timeline-body') || parentElement.querySelector('.card-label');

            if (activeButton && activeButton !== button) {
                const activeParentElement = activeButton.closest('.timeline-panel') || activeButton.closest('.card');
                const activeLabelElement = activeParentElement.querySelector('.timeline-body') || activeParentElement.querySelector('.card-label');
                activeLabelElement.style.display = 'none';
                activeButton.textContent = 'Voir les détails';
            }

            toggleLabel(button, labelElement);
        });
    });


    // Mode clair/sombre
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
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            window.location.href = '/';
            setTimeout(() => window.scrollTo(0, 0), 100);
        });
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
                    iti.setCountry(countryCode); // Forcer la mise à jour
                })
                .catch(() => {
                    callback("fr");
                    iti.setCountry("fr"); // Valeur de repli
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

    // Stockage et restauration des données du formulaire :
    if (form) {
        // Chargement des données du formulaire
        var savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            for (var key in savedData) {
                var field = form.querySelector('[name="' + key + '"]');
                if (field) {
                    field.value = savedData[key];
                }
            }
        }

        // Sauvegarde des données du formulaire avant de quitter
        form.addEventListener('input', function () {
            var formData = new FormData(form);
            var dataObject = {};
            formData.forEach((value, key) => {
                dataObject[key] = value;
            });
            localStorage.setItem('formData', JSON.stringify(dataObject));
        });

        // Nettoyage des données après soumission
        form.addEventListener('submit', function () {
            localStorage.removeItem('formData');
        });
    }

    // Fonction pour appliquer les styles d'accessibilité
    function applyAccessibilityStyles() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

        document.querySelectorAll('.owl-dot').forEach(function(dot) {
            dot.style.width = '24px';
            dot.style.height = '24px';
            dot.style.margin = '5px';
            dot.style.display = 'inline-block';

            const span = dot.querySelector('span');
            if (span) {
                span.style.width = '100%';
                span.style.height = '100%';
                span.style.display = 'block';
                span.style.borderRadius = '50%';
                // Appliquer une couleur différente pour le mode sombre
                span.style.backgroundColor = isDarkMode ? '#3D63DD' : '#FF8552';
            }
        });

        // Changer la couleur de fond du bouton actif
        document.querySelectorAll('.owl-dot.active span').forEach(function(span) {
            span.style.backgroundColor = '#457B9D';
        });
    }

    // Appeler la fonction initialement et lors du changement de thème
    applyAccessibilityStyles();

    toggleSwitch.addEventListener('change', () => {
        // Re-appliquer les styles après le changement de thème
        applyAccessibilityStyles();
    });
});
