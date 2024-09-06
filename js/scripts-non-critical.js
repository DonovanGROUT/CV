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

    // Initialisation de intl-tel-input
    if (input) {
        const iti = window.intlTelInput(input, {
            initialCountry: "auto",
            geoIpLookup: callback => fetch('https://ipinfo.io?token=2ee5851481d61d')
                .then(response => response.json())
                .then(data => callback(data.country.toLowerCase()))
                .catch(() => callback("fr")),
            utilsScript: "dist/utils.min.js"
        });

        input.addEventListener("countrychange", () => {
            input.maxLength = iti.getSelectedCountryData().maxNumberLength || 15;
        });

        form.addEventListener('submit', (e) => {
            // Mettre à jour la valeur du champ téléphone avant l'envoi du formulaire
            input.value = iti.getNumber();
            console.log("Numéro avant soumission : ", input.value); // Affiche le numéro pour déboguer
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
