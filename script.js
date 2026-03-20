
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        closeNav();
    }
}

// WhatsApp integration
function openWhatsApp() {
    const message = encodeURIComponent('Olá! Gostaria de agendar um horário para extensão de cílios.');
    window.open(`https://wa.me/5511966001709?text=${message}`, '_blank');
}

// Instagram integration
function openInstagram() {
    window.open('https://www.instagram.com/studio.lashms/', '_blank');
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
});

// Close nav when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

function closeNav() {
    hamburger.classList.remove('active');
    nav.classList.remove('active');
    document.body.style.overflow = '';
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections with animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-animate');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeNav();
        }
    });

    // Prevent scroll restoration on page reload
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Smooth scroll to top on page load
    window.scrollTo(0, 0);

    // Animated counters (Nossos Resultados)
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const prefersReducedMotion = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const animateCounter = (el) => {
            const target = Number(el.dataset.target || '0');
            const decimals = Number(el.dataset.decimals || '0');

            if (prefersReducedMotion) {
                el.textContent = decimals > 0 ? target.toFixed(decimals) : String(Math.round(target));
                return;
            }

            const durationMs = 900;
            const start = performance.now();
            const from = 0;

            const formatValue = (value) => {
                if (decimals > 0) return value.toFixed(decimals);
                return String(Math.round(value));
            };

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / durationMs, 1);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = from + (target - from) * eased;
                el.textContent = formatValue(current);

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            };

            requestAnimationFrame(tick);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href=\"#${sectionId}\"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = 'var(--color-pink)';
            } else {
                navLink.style.color = 'var(--color-black)';
            }
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img[loading=\"lazy\"]');
    images.forEach(img => imageObserver.observe(img));
}

// Prevent body scroll when mobile menu is open
function preventScroll(e) {
    if (nav.classList.contains('active')) {
        e.preventDefault();
    }
}

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (nav.classList.contains('active') && touchEndX < touchStartX - 50) {
        closeNav();
    }
}

// Performance optimization: debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll event listener
const optimizedScroll = debounce(() => {
    // Scroll-dependent functions here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeNav();
    }
});

// Focus trap for mobile menu accessibility
function focusTrap(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
}

if (nav) {
    focusTrap(nav);
}

console.log('Studio Lash MS - Website carregado com sucesso! ✨');

