// script.js - kompletan, "vrati sve" + popravke za mobilni (ne zaklanja hero title)

// ------------------------ Utilities ------------------------
/**
 * Simple email validation
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show a temporary notification in the top-right corner
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Inline styles so it works even if CSS not present
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg,#4CAF50,#45a049)' : type === 'error' ? 'linear-gradient(45deg,#f44336,#da190b)' : 'linear-gradient(45deg,#667eea,#764ba2)'};
        color: white;
        padding: 0.9rem 1.2rem;
        border-radius: 10px;
        box-shadow: 0 6px 24px rgba(0,0,0,0.25);
        z-index: 99999;
        opacity: 0;
        transform: translateX(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 360px;
        font-weight: 600;
        display:flex;
        gap:0.6rem;
        align-items:center;
    `;

    document.body.appendChild(notification);

    // show
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // hide after 5s
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 350);
    }, 5000);
}

// ------------------------ Header + Nav Behavior ------------------------
/**
 * Toggle mobile nav
 * Expects:
 *  - .nav-toggle (button)
 *  - .nav-menu (ul)
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close nav when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link, a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If it's an anchor to a section, we want smooth scroll; keep behavior handled elsewhere
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Add header shadow on scroll
function initHeaderScrollEffect() {
    const header = document.querySelector('.header') || document.querySelector('.navbar') || null;
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 15, 35, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(15, 15, 35, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// ------------------------ Smooth Scrolling ------------------------
/**
 * Smooth scroll to anchor but offset by header height
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('.header') || document.querySelector('.navbar') || null;

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (!target) return;

            // If link is internal anchor, prevent default and smooth scroll
            e.preventDefault();

            // compute header height (if visible)
            const headerHeight = header ? header.offsetHeight : 0;

            // compute top position, but make sure we don't overshoot (e.g., negative)
            const targetPosition = Math.max(target.offsetTop - headerHeight - 10, 0);

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ------------------------ Contact Form Handling ------------------------
function initContactForm() {
    const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const subject = formData.get('subject')?.trim() || formData.get('title')?.trim();
        const message = formData.get('message')?.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Molim vas popunite sva polja!', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Molim vas unesite validnu email adresu!', 'error');
            return;
        }

        // Simulate sending
        showNotification('Hvala vam! Vaša poruka je uspešno poslata.', 'success');
        this.reset();
    });
}

// ------------------------ Typing Effect for Hero ------------------------
/**
 * Creates a typewriter effect for an element's innerText
 * It reads existing text, clears it, and types it out.
 */
function initTypingEffect(selector = '.hero-title', delay = 50, startDelay = 800) {
    const el = document.querySelector(selector);
    if (!el) return;

    const originalText = el.textContent.trim();
    // Keep markup safe: we'll type plain text only
    el.textContent = '';
    let i = 0;

    setTimeout(function type() {
        if (i < originalText.length) {
            el.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }, startDelay);
}

// ------------------------ Intersection / Scroll Reveal ------------------------
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // optional: unobserve for performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.service-card, .portfolio-item, .skill-item, .projects-grid > .project-card, section .section-title, .contact-form, .contact-info');
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ------------------------ Parallax (desktop only) ------------------------
/**
 * Parallax effect for hero section.
 * Disabled on small screens to avoid layout overlap/performance issues.
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let enabled = true;

    function update() {
        const width = window.innerWidth;
        // disable on small screens
        if (width <= 768) {
            if (enabled) {
                hero.style.transform = 'translateY(0)';
                enabled = false;
            }
            return;
        }
        enabled = true;
    }

    // parallax scroll handler (only active when enabled)
    function onScroll() {
        if (!enabled) return;
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.15; // gentle
        hero.style.transform = `translateY(${rate}px)`;
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', onScroll);
}

// ------------------------ Portfolio Hover Effects ------------------------
function initPortfolioHover() {
    const items = document.querySelectorAll('.portfolio-item, .project-card');
    items.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'transform 0.25s ease';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ------------------------ Skills Animation (stagger) ------------------------
function initSkillsStagger() {
    const skillsSection = document.querySelector('.skills-grid');
    if (!skillsSection) return;

    const skillsObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.skill-item');
                items.forEach((item, idx) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, idx * 120);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    const skillItems = skillsSection.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        item.style.transition = 'all 0.45s cubic-bezier(.2,.8,.2,1)';
    });

    skillsObserver.observe(skillsSection);
}

// ------------------------ Adjust Hero Offset to Avoid Header Overlap ------------------------
/**
 * This is the key fix for the issue you reported:
 * - It calculates header height and ensures the hero section has enough top padding
 *   so that the hero title is not hidden under the fixed header on small screens.
 * - It disables parallax on small screens (to avoid negative translate causing overlap).
 */
function adjustHeroOffset() {
    const header = document.querySelector('.header') || document.querySelector('.navbar') || null;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    function applyOffset() {
        const headerHeight = header ? header.offsetHeight : 0;
        const width = window.innerWidth;

        // On small screens we ensure hero has top padding >= headerHeight + small gap
        if (width <= 768) {
            // we set paddingTop only if it's less than needed
            const currentPaddingTop = parseFloat(window.getComputedStyle(hero).paddingTop) || 0;
            const required = headerHeight + 20; // 20px gap
            if (currentPaddingTop < required) {
                hero.style.paddingTop = required + 'px';
            }
            // disable transform/parallax by clearing transform
            hero.style.transform = 'none';
        } else {
            // On desktop we can remove forced paddingTop (let CSS control)
            // but keep a small default so hero isn't glued to top
            if (hero.style.paddingTop) {
                hero.style.paddingTop = '';
            }
        }
    }

    // run on resize and load
    applyOffset();
    window.addEventListener('resize', applyOffset);
    window.addEventListener('orientationchange', applyOffset);
}

// ------------------------ Smooth reveal of entire sections on load ------------------------
function revealSectionsOnLoad() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, idx) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 120 * idx);
    });
}

// ------------------------ Notification CSS Injection (so notifications look consistent) ------------------------
function injectNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display:flex;
            gap:0.6rem;
            align-items:center;
        }
        .notification-content i { font-size: 1.05rem; opacity:0.95; }
    `;
    document.head.appendChild(style);
}

// ------------------------ Init everything on DOMContentLoaded ------------------------
document.addEventListener('DOMContentLoaded', function () {
    injectNotificationStyles();

    // Navigation
    initMobileNav();
    initHeaderScrollEffect();
    initSmoothScroll();

    // Form handling
    initContactForm();

    // Visual effects
    initTypingEffect('.hero-title', 40, 700);
    initScrollReveal();
    initParallax();
    initPortfolioHover();
    initSkillsStagger();
    revealSectionsOnLoad();

    // Hero offset fix (prevents header from covering hero on mobile)
    adjustHeroOffset();

    // Extra: Accessibility - close mobile menu on escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        }
    });

    // Optional: Improve performance by reducing heavy effects on mobile
    // If screen is small, we disable requestAnimationFrame tasks for parallax (handled in initParallax)
    // and reduce observer thresholds where necessary (kept conservative above).
});

// ------------------------ Optional: fix for deep linking on page load ------------------------
/**
 * If user lands on a link with hash (e.g., /#contact), make sure to adjust scroll so header doesn't overlap.
 * This executes shortly after load to allow browser to jump first and then correct position.
 */
window.addEventListener('load', function () {
    setTimeout(() => {
        const hash = window.location.hash;
        const header = document.querySelector('.header') || document.querySelector('.navbar') || null;
        if (hash && document.querySelector(hash)) {
            const target = document.querySelector(hash);
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = Math.max(target.offsetTop - headerHeight - 10, 0);
            window.scrollTo({ top: targetPosition });
        }
    }, 50);
});
