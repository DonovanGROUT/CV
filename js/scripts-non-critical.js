document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const input = document.querySelector("#phone");
    const form = document.querySelector('form');

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
            console.log("OwlCarousel initialized", event);
            console.log("Dots elements: ", $(".owl-dots").length);

            // Ajout des attributs aria-label aux boutons de navigation
            $('.owl-dot').each(function(index) {
                $(this).attr('aria-label', 'Diapositive ' + (index + 1));
            });

            // Ajout d'un aria-label aux boutons de navigation personnalisés
            $(".custom-owl-prev").attr('aria-label', 'Diapositive précédente');
            $(".custom-owl-next").attr('aria-label', 'Diapositive suivante');
        },
        onChanged: function(event) {
            applyAccessibilityStyles();
        },
        responsive: {
            0: { items: 1 },
            800: { items: 2 },
            1200: { items: 3 }
        }
    });

    $(".custom-owl-next").click(function() {
        $(".carousel").trigger("next.owl.carousel");
    });

    $(".custom-owl-prev").click(function() {
        $(".carousel").trigger("prev.owl.carousel");
    });

    // Fonctionnalité pour animer les barres de progression et la timeline
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('progress-bar')) {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                } else if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('in-view');
                }
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    progressBars.forEach(bar => sectionObserver.observe(bar));
    timelineItems.forEach(item => sectionObserver.observe(item));

    // Mise à jour des liens actifs lors du scroll
    const updateActiveLink = (links, currentId) => {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === currentId);
        });
    };

    const scrollToSection = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - document.querySelector('.navbar').offsetHeight,
                behavior: 'smooth'
            });
            updateActiveLink(navLinks, targetId);
            updateActiveLink(dropdownItems, targetId);
        }
    };

    navLinks.forEach(link => link.addEventListener('click', scrollToSection));
    dropdownItems.forEach(item => item.addEventListener('click', scrollToSection));

    // Fonction pour corriger les attributs ARIA
    function fixAriaAttributes() {
        const flags = document.querySelectorAll('.iti__selected-flag');
        flags.forEach(flag => {
            // Assure que les attributs ARIA sont corrects
            flag.setAttribute('role', 'combobox');
            flag.setAttribute('aria-controls', 'iti-0__country-listbox');
            flag.setAttribute('aria-owns', 'iti-0__country-listbox');
            flag.setAttribute('aria-expanded', 'false'); // Valeur correcte dépend du contexte
            flag.setAttribute('aria-activedescendant', 'iti-0__item-fr-preferred');
            flag.setAttribute('aria-label', 'Drapeau sélectionné');
        });
    }

    // Initialisation de intl-tel-input
    const iti = window.intlTelInput(input, {
        initialCountry: "auto",
        geoIpLookup(callback) {
            fetch('https://ipinfo.io?token=2ee5851481d61d')
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.country ? data.country.toLowerCase() : "fr";
                    callback(countryCode);
                    iti.setCountry(countryCode); // Forcer la mise à jour
                    // Corriger les attributs ARIA après l'initialisation
                    fixAriaAttributes();
                })
                .catch(() => {
                    callback("fr");
                    iti.setCountry("fr"); // Valeur de repli
                    // Corriger les attributs ARIA après l'initialisation
                    fixAriaAttributes();
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
        // Corriger les attributs ARIA avant l'envoi
        fixAriaAttributes();
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

    // Appliquer les styles d'accessibilité
    function applyAccessibilityStyles() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.owl-dot span').forEach(span => {
            span.style.backgroundColor = isDarkMode ? '#3D63DD' : '#FF8552';
        });
    }

    applyAccessibilityStyles();
});
