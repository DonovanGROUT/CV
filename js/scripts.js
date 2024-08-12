document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    const updateActiveLink = (links, current) => {
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            updateActiveLink(navLinks, this.getAttribute('href').substring(1));
        });
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            updateActiveLink(dropdownItems, this.getAttribute('href').substring(1));
        });
    });

    const sections = document.querySelectorAll('section');
    window.onscroll = () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        updateActiveLink(navLinks, current);
        updateActiveLink(dropdownItems, current);
    };
});

document.addEventListener('DOMContentLoaded', function() {
    const skillsSection = document.querySelector('#skills');
    const progressBars = document.querySelectorAll('.progress-bar');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width'); // Lire depuis un data-attribute
                    bar.style.width = targetWidth; // Appliquer la largeur cible
                });
            }
        });
    }, { threshold: 0.1 });

    observer.observe(skillsSection);
});

