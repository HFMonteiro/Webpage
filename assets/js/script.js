// Professional website functionality for Hugo Monteiro
// Enhanced with modern JavaScript best practices

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        animationDelay: 100,
        scrollOffset: 80,
        greeting: 'Welcome to Hugo Monteiro\'s professional portfolio!'
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
            
            // Performance monitoring
            monitorPerformance();
            
            // Log success message
            console.log(CONFIG.greeting);
            console.log('Website initialized successfully with modern enhancements');
            
        } catch (error) {
            console.error('Error initializing website:', error);
            // Fallback for critical functionality
            fallbackInitialization();
        }
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
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe sections for animation
            const sections = document.querySelectorAll('main section');
            sections.forEach((section, index) => {
                section.style.setProperty('--animation-delay', `${index * CONFIG.animationDelay}ms`);
                observer.observe(section);
            });
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
                console.log('Profile image loaded successfully');
            };
            
            img.onerror = function() {
                console.warn('Failed to load profile image, using fallback');
                profileImage.style.opacity = '1';
                profileImage.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="%234a90e2"/><text x="100" y="110" text-anchor="middle" fill="white" font-size="60" font-family="Arial">HM</text></svg>';
                profileImage.alt = 'Hugo Monteiro - Professional Photo (placeholder)';
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
                console.log(`Contact link clicked: ${linkType}`);
                
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
    
    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log(`Page load time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
                    }
                    
                    // Monitor core web vitals if available
                    if ('web-vitals' in window) {
                        // This would require importing web-vitals library
                        console.log('Web Vitals monitoring available');
                    }
                }, 0);
            });
        }
    }
    
    // Fallback initialization for older browsers
    function fallbackInitialization() {
        console.log('Running fallback initialization');
        
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
