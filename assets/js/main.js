// ══════════════ PARTICLE NETWORK SYSTEM ══════════════
        (function () {
            const canvas = document.getElementById('hero-canvas');
            const ctx = canvas.getContext('2d');

            let width, height;
            let particles = [];
            let mouse = { x: null, y: null, radius: 180 };

            // Configuration
            const config = {
                particleCount: 70,
                connectionDistance: 140,
                mouseConnectionDistance: 200,
                particleSpeed: 0.6,
                particleSize: 2,
                lineColor: '255, 255, 255',
                particleColor: '255, 255, 255'
            };

            // Resize canvas
            function resize() {
                const hero = document.getElementById('hero');
                width = hero.offsetWidth;
                height = hero.offsetHeight;
                canvas.width = width;
                canvas.height = height;
            }

            // Create particle
            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.vx = (Math.random() - 0.5) * config.particleSpeed;
                    this.vy = (Math.random() - 0.5) * config.particleSpeed;
                    this.size = Math.random() * config.particleSize + 1;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    // Bounce off edges
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;

                    // Keep within bounds
                    this.x = Math.max(0, Math.min(width, this.x));
                    this.y = Math.max(0, Math.min(height, this.y));
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${config.particleColor}, 0.6)`;
                    ctx.fill();
                }
            }

            // Initialize particles
            function initParticles() {
                particles = [];
                for (let i = 0; i < config.particleCount; i++) {
                    particles.push(new Particle());
                }
            }

            // Draw line between two points with opacity based on distance
            function drawLine(p1, p2, maxDist) {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = 1 - (dist / maxDist);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${config.lineColor}, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Animation loop
            function animate() {
                ctx.clearRect(0, 0, width, height);

                // Update and draw particles
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                // Connect particles to each other
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        drawLine(particles[i], particles[j], config.connectionDistance);
                    }
                }

                // Connect particles to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    particles.forEach(p => {
                        drawLine(p, mouse, config.mouseConnectionDistance);
                    });

                    // Draw mouse glow
                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${config.particleColor}, 0.8)`;
                    ctx.fill();
                }

                requestAnimationFrame(animate);
            }

            // Mouse tracking
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            canvas.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            // Touch support
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                mouse.x = touch.clientX - rect.left;
                mouse.y = touch.clientY - rect.top;
            }, { passive: false });

            canvas.addEventListener('touchend', () => {
                mouse.x = null;
                mouse.y = null;
            });

            // Handle resize
            window.addEventListener('resize', () => {
                resize();
                initParticles();
            });

            // Start
            resize();
            initParticles();
            animate();
        })();

        // ══════════════ EXISTING SCRIPTS ══════════════

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

        // Counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = +el.dataset.target;
                    let current = 0;
                    const step = target / 60;
                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) { el.textContent = target + '+'; clearInterval(timer); }
                        else { el.textContent = Math.floor(current) + '+'; }
                    }, 25);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.count').forEach(el => counterObserver.observe(el));

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

        // Form submission handler
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const formMessage = document.getElementById('formMessage');
                const originalBtnText = submitBtn.innerHTML;

                // Update button state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
                
                // Hide any previous messages
                formMessage.classList.add('d-none');
                formMessage.className = 'mt-3 alert d-none';

                const formData = new FormData(contactForm);

                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        // Show success message
                        formMessage.textContent = json.message || "Thank you! Your message has been sent.";
                        formMessage.classList.add('alert-success');
                        formMessage.classList.remove('d-none');
                        contactForm.reset();
                    } else {
                        // Show error message from server
                        formMessage.textContent = json.message || 'Oops! Something went wrong.';
                        formMessage.classList.add('alert-danger');
                        formMessage.classList.remove('d-none');
                    }
                })
                .catch(error => {
                    // Show error message
                    formMessage.textContent = 'Oops! Something went wrong.';
                    formMessage.classList.add('alert-danger');
                    formMessage.classList.remove('d-none');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            });
        }