/**
 * GSAP + ScrollTrigger Animation Controller
 * Professional animations for Joy Chen's Portfolio
 */

class GSAPAnimationController {
    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Don't run animations if user prefers reduced motion
        if (this.prefersReducedMotion) {
            console.log('Reduced motion preference detected - skipping GSAP animations');
            return;
        }

        // Initialize all animation modules
        this.initHeroAnimations();
        this.initScrollRevealAnimations();
        this.initParallaxEffects();
        this.initTextAnimations();
        this.initImageRevealAnimations();
        this.initStaggerAnimations();
        this.initSmoothScroll();
        this.initNavbarAnimations();

        console.log('🎬 GSAP Animations Initialized');
    }

    /**
     * 1. HERO SECTION ANIMATIONS
     * Dramatic entrance with staggered timeline
     */
    initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title, h1');
        const heroSubtitle = document.querySelector('.hero-subtitle, .lead');
        const heroButtons = document.querySelectorAll('.hero-buttons .btn, .hero .btn');
        const heroImage = document.querySelector('.hero-image, .hero img');

        if (!heroTitle) return;

        // Create master timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from(heroTitle, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
        })
        .from(heroSubtitle, {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from(heroButtons, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15
        }, '-=0.4');

        if (heroImage) {
            tl.from(heroImage, {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }, '-=1');
        }
    }

    /**
     * 2. SCROLL-TRIGGERED FADE & SLIDE ANIMATIONS
     * Elements fade and slide up when scrolling into view
     */
    initScrollRevealAnimations() {
        // Fade up animations
        gsap.utils.toArray('.fade-up, .reveal').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                    // markers: true // Uncomment to debug
                },
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Fade in from left
        gsap.utils.toArray('.fade-left').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Fade in from right
        gsap.utils.toArray('.fade-right').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Scale up animations
        gsap.utils.toArray('.scale-up').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)'
            });
        });
    }

    /**
     * 3. PARALLAX EFFECTS
     * Elements move at different speeds for depth
     */
    initParallaxEffects() {
        gsap.utils.toArray('.parallax-slow').forEach(element => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -50,
                ease: 'none'
            });
        });

        gsap.utils.toArray('.parallax-fast').forEach(element => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: 100,
                ease: 'none'
            });
        });
    }

    /**
     * 4. TEXT ANIMATIONS
     * Character-by-character or word-by-word reveals
     */
    initTextAnimations() {
        // Split text into words and animate
        gsap.utils.toArray('.text-reveal').forEach(element => {
            const words = element.textContent.split(' ');
            element.innerHTML = words.map(word =>
                `<span class="word" style="display: inline-block; overflow: hidden;">
                    <span style="display: inline-block;">${word}</span>
                </span>`
            ).join(' ');

            const wordElements = element.querySelectorAll('.word span');

            gsap.from(wordElements, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power3.out'
            });
        });

        // Underline animation
        gsap.utils.toArray('.underline-reveal').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                backgroundSize: '0% 3px',
                duration: 1.2,
                ease: 'power2.inOut'
            });
        });
    }

    /**
     * 5. IMAGE REVEAL ANIMATIONS
     * Clip-path reveals for images
     */
    initImageRevealAnimations() {
        gsap.utils.toArray('.image-reveal').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                clipPath: 'inset(0 100% 0 0)',
                duration: 1.5,
                ease: 'power3.inOut'
            });
        });

        // Zoom out effect
        gsap.utils.toArray('.image-zoom').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 1.3,
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }

    /**
     * 6. STAGGER ANIMATIONS
     * Animate groups of elements in sequence
     */
    initStaggerAnimations() {
        // Portfolio cards
        gsap.utils.toArray('.portfolio-module, .card-group > *, .grid-item').forEach(container => {
            const items = container.querySelectorAll('.card, .item, .module-content');
            if (items.length === 0) return;

            gsap.from(items, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        });

        // Feature lists
        gsap.utils.toArray('.feature-list, .list-animated').forEach(list => {
            const items = list.querySelectorAll('li, .list-item');
            if (items.length === 0) return;

            gsap.from(items, {
                scrollTrigger: {
                    trigger: list,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: -50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
    }

    /**
     * 7. SMOOTH SCROLL
     * Smooth scrolling for anchor links
     */
    initSmoothScroll() {
        gsap.utils.toArray('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 80 },
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    }

    /**
     * 8. NAVBAR ANIMATIONS
     * Hide/show navbar on scroll
     */
    initNavbarAnimations() {
        const navbar = document.querySelector('nav, header nav, .navbar');
        if (!navbar) return;

        let lastScroll = 0;

        ScrollTrigger.create({
            start: 'top -100',
            end: 99999,
            onUpdate: (self) => {
                const currentScroll = self.scroll();

                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down
                    gsap.to(navbar, {
                        yPercent: -100,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                } else {
                    // Scrolling up
                    gsap.to(navbar, {
                        yPercent: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                }

                lastScroll = currentScroll;
            }
        });

        // Add background on scroll
        ScrollTrigger.create({
            start: 'top -50',
            end: 99999,
            onEnter: () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled')
        });
    }

    /**
     * 9. PIN SECTION (Sticky Scroll)
     * Pin a section while content scrolls
     * Example usage: Add data-pin="true" to any section
     */
    initPinSections() {
        gsap.utils.toArray('[data-pin="true"]').forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: '+=1000',
                pin: true,
                pinSpacing: true,
                markers: false
            });
        });
    }

    /**
     * 10. PROGRESS INDICATOR
     * Show scroll progress bar
     */
    initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        gsap.to(progressBar, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GSAPAnimationController();
});

/**
 * USAGE GUIDE:
 *
 * Add these classes to your HTML elements to enable animations:
 *
 * FADE ANIMATIONS:
 * - .fade-up      → Fade in from bottom
 * - .fade-left    → Fade in from left
 * - .fade-right   → Fade in from right
 * - .scale-up     → Scale up with fade
 *
 * PARALLAX:
 * - .parallax-slow → Moves slowly (depth effect)
 * - .parallax-fast → Moves faster
 *
 * TEXT EFFECTS:
 * - .text-reveal  → Word-by-word reveal
 * - .underline-reveal → Animated underline
 *
 * IMAGE EFFECTS:
 * - .image-reveal → Clip-path reveal
 * - .image-zoom   → Zoom out effect
 *
 * ADVANCED:
 * - data-pin="true" → Pin section on scroll
 *
 * Example:
 * <div class="fade-up">This will fade up when scrolled into view</div>
 * <h2 class="text-reveal">This text reveals word by word</h2>
 * <img class="image-zoom" src="..." alt="...">
 */
