document.addEventListener('DOMContentLoaded', function() {
    // Variables pour les liens de navigation et les sections
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const sections = document.querySelectorAll('section');
    const progressBars = document.querySelectorAll('.progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');

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

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Observer pour les timelines
    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
});
