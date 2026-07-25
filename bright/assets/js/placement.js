// Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('mainNav');
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Intersection Observer for fade-up animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

        // Filter functionality
        function applyFilters() {
            const domain = document.getElementById('filterDomain').value;
            const exp = document.getElementById('filterExp').value;
            const location = document.getElementById('filterLocation').value;
            const cards = document.querySelectorAll('.call-card-wrapper');

            cards.forEach(card => {
                const cardDomain = card.dataset.domain;
                const cardExp = card.dataset.exp;
                const cardLocation = card.dataset.location;

                const matchDomain = domain === 'all' || cardDomain === domain;
                const matchExp = exp === 'all' || cardExp === exp;
                const matchLocation = location === 'all' || cardLocation === location;

                if (matchDomain && matchExp && matchLocation) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        }

        function resetFilters() {
            document.getElementById('filterDomain').value = 'all';
            document.getElementById('filterExp').value = 'all';
            document.getElementById('filterLocation').value = 'all';
            const cards = document.querySelectorAll('.call-card-wrapper');
            cards.forEach(card => {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            });
        }

        // Smooth active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(s => {
                if (window.scrollY >= s.offsetTop - 120) current = s.id;
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        });