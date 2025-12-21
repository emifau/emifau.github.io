/* =====================================================
   PhotoFau - Photo-First Portfolio
   JavaScript Interactions
   ===================================================== */


/* ==================== Navbar ==================== */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const navTargets = new Set(
        Array.from(navLinks)
            .map(link => link.getAttribute('href'))
            .filter(Boolean)
            .map(href => href.replace('#', ''))
    );

    window.addEventListener('scroll', () => {
        // Scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (!navTargets.has(sectionId)) return;

            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` ||
                (link.getAttribute('href') === '#home' && current === 'home')) {
                link.classList.add('active');
            }
        });
    });
}

/* ==================== Mobile Menu ==================== */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ==================== Hero Gallery ==================== */
function initHeroGallery() {
    const heroImages = document.querySelectorAll('.hero-image');
    const thumbs = document.querySelectorAll('.thumb');

    if (heroImages.length === 0 || thumbs.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;

    function showImage(index) {
        heroImages.forEach(img => img.classList.remove('active'));
        thumbs.forEach(thumb => thumb.classList.remove('active'));

        heroImages[index].classList.add('active');
        thumbs[index].classList.add('active');
        currentIndex = index;
    }

    function nextImage() {
        const next = (currentIndex + 1) % heroImages.length;
        showImage(next);
    }

    // Thumb click handlers
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showImage(index);
            resetAutoPlay();
        });
    });

    // Auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextImage, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    const heroMain = document.querySelector('.hero-main');
    if (heroMain) {
        heroMain.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        heroMain.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (window.scrollY > window.innerHeight / 2) return;

        if (e.key === 'ArrowLeft') {
            const prev = (currentIndex - 1 + heroImages.length) % heroImages.length;
            showImage(prev);
            resetAutoPlay();
        }
        if (e.key === 'ArrowRight') {
            nextImage();
            resetAutoPlay();
        }
    });
}

/* ==================== Portfolio Filter ==================== */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

/* ==================== Lightbox ==================== */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCategory = document.querySelector('.lightbox-category');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!lightbox) return;

    let currentIndex = 0;
    let visibleItems = [];

    // Open lightbox
    portfolioItems.forEach((item) => {
        item.addEventListener('click', () => {
            visibleItems = Array.from(portfolioItems).filter(i => !i.classList.contains('hidden'));
            currentIndex = visibleItems.indexOf(item);
            openLightbox(item);
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('img');
        const category = item.querySelector('.item-category')?.textContent || '';
        const title = item.querySelector('.item-title')?.textContent || '';

        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        lightboxCategory.textContent = category;
        lightboxTitle.textContent = title;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navigation
    function updateLightbox() {
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const category = item.querySelector('.item-category')?.textContent || '';
        const title = item.querySelector('.item-title')?.textContent || '';

        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = title;
            lightboxCategory.textContent = category;
            lightboxTitle.textContent = title;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    lightboxImg.style.transition = 'opacity 0.2s ease';

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightbox();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightbox();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            updateLightbox();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            updateLightbox();
        }
    });
}

/* ==================== Contact Form ==================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = 'Enviado! Gracias';
            submitBtn.style.background = 'linear-gradient(135deg, #4ECDC4, #45B7D1)';
            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/* ==================== Smooth Scroll ==================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== Update Year ==================== */
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ==================== Scroll Reveal Animation ==================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .stagger-children');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ==================== Add Reveal Classes to Elements ==================== */
function addRevealClasses() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal');
    });

    // Portfolio masonry grid
    const portfolioGrid = document.querySelector('.portfolio-masonry');
    if (portfolioGrid) {
        portfolioGrid.classList.add('stagger-children');
    }

    // Course cards
    document.querySelectorAll('.course-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    // About section
    const aboutImage = document.querySelector('.about-image');
    const aboutText = document.querySelector('.about-text');
    if (aboutImage) aboutImage.classList.add('reveal-left');
    if (aboutText) aboutText.classList.add('reveal-right');

    // Contact section
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form-wrapper');
    if (contactInfo) contactInfo.classList.add('reveal-left');
    if (contactForm) contactForm.classList.add('reveal-right');

    // Stats
    const stats = document.querySelector('.about-stats');
    if (stats) stats.classList.add('stagger-children');

    // Courses grid
    const coursesGrid = document.querySelector('.courses-grid');
    if (coursesGrid) coursesGrid.classList.add('stagger-children');

    // Services grid
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) servicesGrid.classList.add('stagger-children');

    // Testimonials grid
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) testimonialsGrid.classList.add('stagger-children');
}

/* ==================== Floating Particles ==================== */
function initParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';

    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);
}

/* ==================== Page Loader ==================== */
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">PhotoFau</div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 1500);
    });
}

/* ==================== Cursor Trail Effect ==================== */
function initCursorTrail() {
    if (window.innerWidth < 768) return; // Disable on mobile

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        trail.style.opacity = '0.6';
    });

    document.addEventListener('mouseleave', () => {
        trail.style.opacity = '0';
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';

        requestAnimationFrame(animateTrail);
    }

    animateTrail();
}

/* ==================== Parallax Effect on Hero ==================== */
function initParallax() {
    const heroBrand = document.querySelector('.hero-brand');
    const heroCaption = document.querySelector('.image-caption');

    if (!heroBrand && !heroCaption) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY < heroHeight) {
            const parallaxOffset = scrollY * 0.3;
            const opacity = 1 - (scrollY / heroHeight);

            if (heroBrand) {
                heroBrand.style.transform = `translate(-50%, calc(-50% + ${parallaxOffset}px))`;
                heroBrand.style.opacity = Math.max(0.15, opacity * 0.15);
            }

            if (heroCaption) {
                heroCaption.style.transform = `translateY(${parallaxOffset * 0.5}px)`;
                heroCaption.style.opacity = Math.max(0, opacity);
            }
        }
    });
}

/* ==================== Magnetic Buttons ==================== */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .thumb');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ==================== Text Scramble Effect ==================== */
function initTextScramble() {
    const chars = '!<>-_\\/[]{}\"?=+*^#________';

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = chars;
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Apply to section titles on scroll
    const sectionTitles = document.querySelectorAll('.section-title');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                entry.target.dataset.scrambled = 'true';
                const fx = new TextScramble(entry.target);
                const originalText = entry.target.textContent;
                fx.setText(originalText);
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => observer.observe(title));
}

/* ==================== Counter Animation ==================== */
function initCounterAnimation() {
    const statValues = document.querySelectorAll('.stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));

    function animateCounter(el) {
        const text = el.textContent;
        const match = text.match(/(\d+\.?\d*)/);
        if (!match) return;

        const target = parseFloat(match[1]);
        const suffix = text.replace(match[1], '');
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;

            if (target >= 100) {
                el.textContent = Math.floor(current) + suffix;
            } else {
                el.textContent = current.toFixed(1).replace(/\.0$/, '') + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = text; // Restore original
            }
        }

        requestAnimationFrame(update);
    }
}

/* ==================== Tilt Effect on Cards ==================== */
function initTiltEffect() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.course-card, .portfolio-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ==================== Initialize All Animations ==================== */
// Run page loader first
initPageLoader();

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initHeroGallery();
    initPortfolioFilter();
    initLightbox();
    initContactForm();
    initSmoothScroll();
    updateYear();

    // Creative Animations
    addRevealClasses();
    initScrollReveal();
    initParticles();
    initCursorTrail();
    initParallax();
    initMagneticButtons();
    initCounterAnimation();
    initTiltEffect();
});
