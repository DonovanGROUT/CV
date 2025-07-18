document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
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
        onInitialized: function (event) {

            // Ajout des attributs aria-label aux boutons de navigation
            $('.owl-dot').each(function (index) {
                $(this).attr('aria-label', 'Projet ' + (index + 1));
            });

            // Ajout d'un aria-label aux boutons de navigation personnalisés
            $(".custom-owl-prev").attr('aria-label', 'Projet précédent');
            $(".custom-owl-next").attr('aria-label', 'Projet suivant');
        },
        onChanged: function (event) {
            applyAccessibilityStyles();
        },
        responsive: {
            0: { items: 1 },
            800: { items: 2 },
            1200: { items: 3 }
        }
    });

    $(".custom-owl-next").click(function () {
        $(".carousel").trigger("next.owl.carousel");
    });

    $(".custom-owl-prev").click(function () {
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
        const href = e.currentTarget.getAttribute('href');
        
        // Ignorer les liens externes (qui ne commencent pas par #)
        if (!href.startsWith('#')) {
            return; // Laisser le navigateur gérer le lien normalement
        }
        
        e.preventDefault();
        const targetId = href.substring(1);
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

    // Gestion des boutons "Voir les détails"
    const viewLabelButtons = document.querySelectorAll('.view-label-btn');
    let activeButton = null;

    // Détecte si l'appareil est tactile
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    // Fonction pour masquer le texte et réinitialiser les boutons
    function resetActiveButton() {
        if (activeButton) {
            const activeParentElement = activeButton.closest('.timeline-panel') || activeButton.closest('.card');
            const activeLabelElement = activeParentElement.querySelector('.timeline-body') || activeParentElement.querySelector('.card-label');
            activeLabelElement.style.display = 'none';
            activeButton.textContent = 'Voir les détails';
            activeButton = null;
        }
    }

    if (isTouchDevice) {
        // Pour les appareils tactiles : gestion du clic sur le bouton
        viewLabelButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const parentElement = button.closest('.timeline-panel') || button.closest('.card');
                const labelElement = parentElement.querySelector('.timeline-body') || parentElement.querySelector('.card-label');

                // Si un autre bouton est déjà actif, on le réinitialise
                if (activeButton && activeButton !== button) {
                    resetActiveButton();
                }

                // Affiche ou cache le texte associé au bouton
                if (labelElement.style.display === 'block') {
                    labelElement.style.display = 'none';
                    button.textContent = 'Voir les détails';
                } else {
                    labelElement.style.display = 'block';
                    button.textContent = 'Cacher les détails';
                    activeButton = button;
                }
            });
        });
    } else {
        // Pour les appareils non tactiles : le texte s'affiche au survol
        viewLabelButtons.forEach(button => {
            const parentElement = button.closest('.timeline-panel') || button.closest('.card');
            const labelElement = parentElement.querySelector('.timeline-body') || parentElement.querySelector('.card-label');

            parentElement.addEventListener('mouseenter', () => {
                labelElement.style.display = 'block';
            });

            parentElement.addEventListener('mouseleave', () => {
                labelElement.style.display = 'none';
            });
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
                    iti.setCountry(countryCode);
                })
                .catch(() => {
                    callback("fr");
                    iti.setCountry("fr");
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
        
        // Vérification si nous sommes en environnement local
        if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
            // En local, empêcher la soumission normale et rediriger
            event.preventDefault();
            
            // Valider que la case RGPD est cochée
            const rgpdConsent = document.getElementById('rgpd-consent');
            if (rgpdConsent && !rgpdConsent.checked) {
                alert('Veuillez accepter les conditions de confidentialité pour continuer.');
                return;
            }
            
            // Nettoyer les données stockées
            localStorage.removeItem('formData');
            
            // Rediriger vers la page de remerciement
            window.location.href = 'remerciement-formulaire.html';
        }
        // En production (Netlify), laisser le formulaire se soumettre normalement
    });

    // Stockage et restauration des données du formulaire
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
