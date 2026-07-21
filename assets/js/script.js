// Professional website functionality for Hugo Monteiro
// Enhanced with modern JavaScript best practices

(function() {
    'use strict';

    document.documentElement.classList.add('motion-ready');
    
    // Configuration
    const CONFIG = {
        animationDelay: 100,
        scrollOffset: 80
    };
    
    // Utility functions
    const utils = {
        // Debounce function for performance optimization
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };
    
    // Main initialization function
    function initializeWebsite() {
        try {
            // Set current year in footer
            setCurrentYear();

            // Initialize subtle entry and page-to-page transitions
            initializePageTransitions();

            // Initialize theme toggle
            initializeThemeToggle();

            // Initialize smooth scrolling
            initializeSmoothScrolling();

            // Initialize intersection observer for animations
            initializeScrollAnimations();

            // Initialize accessibility features
            initializeAccessibility();

            // Initialize image loading with error handling
            initializeImageLoading();

            // Initialize contact form interactions
            initializeContactInteractions();

            // Initialize scroll to top button
            initializeScrollToTop();

        } catch (error) {
            console.error('Error initializing website:', error);
            // Fallback for critical functionality
            fallbackInitialization();
        }
    }
    
    // Initialize dark/light theme toggle
    function initializeThemeToggle() {
        const themeToggleBtn = document.getElementById('theme-toggle');

        if (!themeToggleBtn) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';

        // Apply the theme
        applyTheme(currentTheme);

        // Update button aria-label based on current theme
        updateThemeButtonLabel(themeToggleBtn, currentTheme);

        // Toggle theme on button click
        themeToggleBtn.addEventListener('click', function() {
            let theme = document.documentElement.getAttribute('data-theme');

            // Toggle between light and dark
            if (theme === 'light') {
                theme = 'dark';
            } else {
                theme = 'light';
            }

            // Apply new theme
            applyTheme(theme);

            // Save preference
            localStorage.setItem('theme', theme);

            // Update button label
            updateThemeButtonLabel(themeToggleBtn, theme);

        });

        // Keyboard accessibility
        themeToggleBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark') {
            document.body.style.backgroundColor = '#1a1a1a';
            document.body.style.color = '#e8e8e8';
            document.body.style.colorScheme = 'only dark';
            document.body.style.forcedColorAdjust = 'none';
        } else {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#111111';
            document.body.style.colorScheme = 'only light';
            document.body.style.forcedColorAdjust = 'none';
        }
    }

    // Update theme button aria-label
    function updateThemeButtonLabel(button, theme) {
        const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
        const isPortuguese = htmlLang.startsWith('pt');

        const label = theme === 'dark'
            ? (isPortuguese
                ? 'Alternar para modo claro'
                : 'Switch to light mode')
            : (isPortuguese
                ? 'Alternar para modo escuro'
                : 'Switch to dark mode');

        button.setAttribute('aria-label', label);
    }

    // Set footer copyright year dynamically
    function setCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = currentYear;
            yearElement.setAttribute('aria-label', `Copyright ${currentYear}`);
        }
    }

    function initializePageTransitions() {
        const root = document.documentElement;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const showPage = function() {
            root.classList.remove('page-leaving');
            window.requestAnimationFrame(function() {
                root.classList.add('page-ready');
            });
        };

        showPage();
        window.addEventListener('pageshow', showPage);

        if (prefersReducedMotion) {
            return;
        }

        document.addEventListener('click', function(event) {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const link = event.target.closest('a[href]');
            if (!link || link.hasAttribute('download') || link.target === '_blank') {
                return;
            }

            const destination = new URL(link.href, window.location.href);
            const sameDocumentHash = destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash;

            if (destination.origin !== window.location.origin || sameDocumentHash || root.classList.contains('page-leaving')) {
                return;
            }

            event.preventDefault();
            root.classList.remove('page-ready');
            root.classList.add('page-leaving');

            window.setTimeout(function() {
                window.location.assign(destination.href);
            }, 180);
        });
    }
    
    // Enhanced smooth scrolling with accessibility
    function initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate scroll position with offset
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - CONFIG.scrollOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    
                    // Remove tabindex after focus
                    setTimeout(() => {
                        targetElement.removeAttribute('tabindex');
                    }, 1000);
                    
                    // Update URL without triggering scroll
                    if (history.pushState) {
                        history.pushState(null, null, `#${targetId}`);
                    }
                }
            });
        });
    }
    
    // Initialize scroll-triggered animations
    function initializeScrollAnimations() {
        const targets = document.querySelectorAll('main section:not(.home-hero):not(.home-work), .activity-row');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        targets.forEach((target, index) => {
            target.style.setProperty('--animation-delay', `${Math.min(index, 4) * 70}ms`);
            target.classList.add('reveal-target');
        });

        if (prefersReducedMotion) {
            targets.forEach(target => target.classList.add('is-visible'));
            return;
        }

        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            targets.forEach(target => observer.observe(target));
        } else {
            targets.forEach(target => target.classList.add('is-visible'));
        }
    }
    
    // Enhanced accessibility features
    function initializeAccessibility() {
        // Respect existing skip link in markup (avoid duplicates)
        // Ensure main landmark has an id for skip links
        
        // Add main landmark if not present
        const mainElement = document.querySelector('main');
        if (mainElement && !mainElement.hasAttribute('id')) {
            mainElement.setAttribute('id', 'main');
        }
        
        // Enhance contact links with better accessibility
        const contactLinks = document.querySelectorAll('.contact-link');
        contactLinks.forEach(link => {
            if (link.getAttribute('href').includes('linkedin')) {
                link.setAttribute('aria-label', `Visit Hugo Monteiro's LinkedIn profile (opens in new tab)`);
            }
        });
    }
    
    // Image loading with error handling
    function initializeImageLoading() {
        const profileImage = document.querySelector('.profile-photo');
        if (profileImage) {
            // Add loading state
            profileImage.style.opacity = '0.5';
            
            const img = new Image();
            img.onload = function() {
                profileImage.style.opacity = '1';
                profileImage.setAttribute('aria-label', 'Hugo Monteiro professional headshot');
            };
            
            img.onerror = function() {
                profileImage.style.display = 'none';
                profileImage.closest('.home-hero__portrait, .bio-image')?.classList.add('image-unavailable');
            };
            
            img.src = profileImage.src;
        }
    }
    
    // Contact interactions
    function initializeContactInteractions() {
        const contactLinks = document.querySelectorAll('.contact-link');
        
        contactLinks.forEach(link => {
            // Add keyboard support
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Add analytics tracking (if needed)
            link.addEventListener('click', function() {
                const linkType = this.textContent.toLowerCase().trim();

                // Could integrate with analytics here
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_click', {
                        'event_category': 'engagement',
                        'event_label': linkType
                    });
                }
            });
        });
    }

    // Initialize scroll to top button
    function initializeScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');

        if (!scrollToTopBtn) {
            console.warn('Scroll to top button not found');
            return;
        }

        // Show/hide button based on scroll position
        const toggleScrollButton = utils.debounce(function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }, 100);

        // Listen to scroll events
        window.addEventListener('scroll', toggleScrollButton);

        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Focus on the top of the page for accessibility
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            }
        });

        // Keyboard accessibility
        scrollToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Fallback initialization for older browsers
    function fallbackInitialization() {
        // Basic year setting
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // Basic smooth scrolling fallback
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWebsite);
    } else {
        initializeWebsite();
    }
    
})();
