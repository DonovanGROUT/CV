document.addEventListener('DOMContentLoaded', function() {
    // Variables pour les liens de navigation et les sections
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');

    // Fonction pour mettre à jour les liens actifs
    const updateActiveLink = (links, current) => {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
        });
    };

    // Ajout d'événements de clic pour un défilement fluide
    [...navLinks, ...dropdownItems].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            updateActiveLink(navLinks, this.getAttribute('href').substring(1));
        });
    });

    // Gestion de l'événement de défilement
    window.onscroll = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 60;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        updateActiveLink(navLinks, currentSection);
        updateActiveLink(dropdownItems, currentSection);
    };

    // Observer pour les barres de progression
    const observer = new IntersectionObserver(entries => {
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

    // Observer pour les barres de progression
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
});
