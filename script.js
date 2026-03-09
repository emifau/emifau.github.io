/* ================================
   CABAÑAS BOSQUE NELTUME
   JavaScript Interactions
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounterAnimation();
    initLightbox();
    initTestimonialsCarousel();
    initSmoothScroll();
    initFormValidation();
    initCurrentYear();
    initParallax();
});

/* ================================
   NAVBAR SCROLL EFFECT
   ================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when scrolled down
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ================================
   MOBILE MENU
   ================================ */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ================================
   SCROLL REVEAL ANIMATIONS
   ================================ */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add stagger effect for children if specified
                if (entry.target.classList.contains('reveal-stagger')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

/* ================================
   COUNTER ANIMATION
   ================================ */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('es-CL');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('es-CL');
        }
    }, 16);
}

/* ================================
   LIGHTBOX GALLERY
   ================================ */
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.dataset.src);
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });
    
    function openLightbox() {
        lightboxImage.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImage.src = images[currentIndex];
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
        }
    });
}

/* ================================
   TESTIMONIALS CAROUSEL
   ================================ */
function initTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let autoplayInterval;
    
    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Click on dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % dots.length;
            goToSlide(currentSlide);
        }, 5000);
    }
    
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSlide < dots.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
            resetAutoplay();
        }
    }
    
    startAutoplay();
}

/* ================================
   SMOOTH SCROLL
   ================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================
   FORM VALIDATION
   ================================ */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        const errors = [];
        
        if (!data.name || data.name.length < 2) {
            errors.push('Por favor ingresa tu nombre completo');
            isValid = false;
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Por favor ingresa un email válido');
            isValid = false;
        }
        
        if (!data.checkin) {
            errors.push('Por favor selecciona una fecha de llegada');
            isValid = false;
        }
        
        if (!data.checkout) {
            errors.push('Por favor selecciona una fecha de salida');
            isValid = false;
        }
        
        if (!data.guests) {
            errors.push('Por favor selecciona el número de huéspedes');
            isValid = false;
        }
        
        // Check dates
        if (data.checkin && data.checkout) {
            const checkin = new Date(data.checkin);
            const checkout = new Date(data.checkout);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkin < today) {
                errors.push('La fecha de llegada no puede ser anterior a hoy');
                isValid = false;
            }
            
            if (checkout <= checkin) {
                errors.push('La fecha de salida debe ser posterior a la de llegada');
                isValid = false;
            }
        }
        
        if (isValid) {
            // Success feedback
            showFormSuccess(form);
        } else {
            showFormErrors(errors);
        }
    });
    
    // Set min date for date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.addEventListener('change', () => {
            if (checkoutInput) {
                checkoutInput.setAttribute('min', checkinInput.value);
            }
        });
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showFormSuccess(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span>✓ ¡Enviado con éxito!</span>';
    button.style.background = 'linear-gradient(135deg, #2D5016 0%, #3D6B1F 100%)';
    
    // Reset form
    form.reset();
    
    // Reset button after delay
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 3000);
}

function showFormErrors(errors) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(el => el.remove());
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        color: #ff6b6b;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
        font-size: 0.9rem;
    `;
    
    errorContainer.innerHTML = errors.map(e => `• ${e}`).join('<br>');
    
    // Insert at top of form
    const form = document.getElementById('contact-form');
    form.insertBefore(errorContainer, form.firstChild);
    
    // Remove after delay
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

/* ================================
   CURRENT YEAR
   ================================ */
function initCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ================================
   PARALLAX EFFECT
   ================================ */
function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroImage) return;
    
    // Only on desktop
    if (window.innerWidth < 768) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `scale(1.1) translateY(${rate}px)`;
        }
    });
}

/* ================================
   NEWSLETTER FORM
   ================================ */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const button = newsletterForm.querySelector('button');
        
        if (input.value && isValidEmail(input.value)) {
            button.textContent = '✓';
            button.style.background = 'linear-gradient(135deg, #2D5016 0%, #3D6B1F 100%)';
            input.value = '';
            
            setTimeout(() => {
                button.textContent = '→';
                button.style.background = '';
            }, 2000);
        }
    });
}

/* ================================
   SMOOTH LOADING
   ================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations for hero section
    const heroElements = document.querySelectorAll('.hero .reveal');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, index * 200);
    });
});

/* ================================
   ACTIVE NAV LINK HIGHLIGHT
   ================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
