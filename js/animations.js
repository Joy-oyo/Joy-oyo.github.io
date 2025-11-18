// Scroll-reveal animations for split sections
class ScrollRevealController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15,
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Once revealed, we can unobserve to avoid toggling
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.reveal').forEach((el) => this.observer.observe(el));

        // Optional: smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollRevealController();

    // Initialize Lottie animations with reduced-motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lottieElements = document.querySelectorAll('[data-lottie-src]');

    if (window.lottie && lottieElements.length) {
        lottieElements.forEach((el) => {
            const src = el.getAttribute('data-lottie-src');
            if (!src) return;

            try {
                const anim = lottie.loadAnimation({
                    container: el,
                    renderer: 'svg',
                    loop: !prefersReducedMotion,
                    autoplay: !prefersReducedMotion,
                    path: src,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice',
                        progressiveLoad: true,
                        hideOnTransparent: true,
                    },
                });

                // If reduced motion, reveal a static frame
                if (prefersReducedMotion) {
                    anim.addEventListener('DOMLoaded', () => {
                        anim.goToAndStop(15, true);
                    });
                }
            } catch (e) {
                // Fail silently to avoid breaking the page
                console.warn('Lottie init failed for', src, e);
            }
        });
    }

    // Count-up stats when in view
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                if (el.dataset.animated === 'true') return;
                el.dataset.animated = 'true';

                const target = parseInt(el.getAttribute('data-target') || '0', 10);
                if (!Number.isFinite(target)) return;

                if (prefersReducedMotion) {
                    el.textContent = target.toString();
                    statObserver.unobserve(el);
                    return;
                }

                const duration = 1500;
                const start = performance.now();
                const startVal = 0;

                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    const current = Math.floor(startVal + (target - startVal) * eased);
                    el.textContent = current.toString();
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target.toString();
                        statObserver.unobserve(el);
                    }
                };
                requestAnimationFrame(step);
            });
        }, { threshold: 0.3 });

        statNumbers.forEach((el) => statObserver.observe(el));
    }

    // Horizontal timeline controls (Personal Journey)
    const timelineTrack = document.getElementById('journeyTimeline');
    if (timelineTrack) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        const prevBtn = document.querySelector('.timeline-wrap .prev');
        const nextBtn = document.querySelector('.timeline-wrap .next');

        const getScrollAmount = () => {
            const firstItem = timelineTrack.querySelector('.timeline-item');
            const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 300;
            const viewport = timelineTrack.getBoundingClientRect().width;
            return Math.max(itemWidth, viewport * 0.8);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                timelineTrack.scrollBy({ left: -getScrollAmount(), behavior });
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                timelineTrack.scrollBy({ left: getScrollAmount(), behavior });
            });
        }

        // Keyboard support when the track is focused
        timelineTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                timelineTrack.scrollBy({ left: getScrollAmount(), behavior });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                timelineTrack.scrollBy({ left: -getScrollAmount(), behavior });
            }
        });
    }
});