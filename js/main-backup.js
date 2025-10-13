;(function () {
    
    'use strict';

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    // Throttle function for performance
    var throttle = function(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    };

    var fullHeight = function() {
        if (!isMobile.any()) {
            var setHeight = function() {
                $('.js-fullheight').css('height', $(window).height());
            };
            setHeight();
            $(window).resize(throttle(setHeight, 250));
        }
    };

    // Optimized Parallax - only on desktop and when visible
    var parallax = function() {
        if (!isMobile.any() && 'IntersectionObserver' in window) {
            var parallaxElements = $('.parallax-element');
            if (parallaxElements.length > 0) {
                $(window).stellar({
                    responsive: true,
                    parallaxBackgrounds: true,
                    parallaxElements: false,
                    hideDistantElements: false
                });
            }
        }
    };

    var contentWayPoint = function() {
        if (!('IntersectionObserver' in window)) return;
        
        var animateBoxes = document.querySelectorAll('.animate-box');
        if (animateBoxes.length === 0) return;

        var observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated-fast')) {
                    entry.target.classList.add('item-animate');
                    
                    setTimeout(() => {
                        var effect = entry.target.getAttribute('data-animate-effect');
                        var animationClass = 'fadeInUp';
                        
                        if (effect === 'fadeIn') {
                            animationClass = 'fadeIn';
                        } else if (effect === 'fadeInLeft') {
                            animationClass = 'fadeInLeft';
                        } else if (effect === 'fadeInRight') {
                            animationClass = 'fadeInRight';
                        }
                        
                        entry.target.classList.add(animationClass, 'animated-fast');
                        entry.target.classList.remove('item-animate');
                    }, index * 50);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -15% 0px' });

        animateBoxes.forEach(box => observer.observe(box));
    };

    var goToTop = function() {
        $('.js-gotop').on('click', function(event) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        var scrollHandler = throttle(function() {
            var $win = $(window);
            if ($win.scrollTop() > 200) {
                $('.js-top').addClass('active');
            } else {
                $('.js-top').removeClass('active');
            }
        }, 100);

        $(window).scroll(scrollHandler);
    };

    var pieChart = function() {
        $('.chart').each(function() {
            $(this).easyPieChart({
                scaleColor: false,
                lineWidth: 4,
                lineCap: 'butt',
                barColor: '#FF9000',
                trackColor: "#f5f5f5",
                size: 160,
                animate: 1000
            });
        });
    };

    var skillsWayPoint = function() {
        var skillsSection = document.getElementById('fh5co-skills');
        if (!skillsSection) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        setTimeout(pieChart, 400);
                        entry.target.classList.add('animated');
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(skillsSection);
        }
    };

    // Loading page
    var loaderPage = function() {
        $(".fh5co-loader").fadeOut("slow");
    };

    // Main initialization - optimized order
    $(function() {
        // Critical functions first
        loaderPage();
        
        // Defer less critical functions
        requestAnimationFrame(() => {
            contentWayPoint();
            goToTop();
        });
        
        // Heavy functions last
        setTimeout(() => {
            fullHeight();
            if (!isMobile.any()) {
                parallax();
            }
            skillsWayPoint();
        }, 100);
    });

}());

// Optimized profile container interaction
function initProfileInteraction() {
    const profileContainer = document.querySelector('.profile-container');
    if (!profileContainer) return;

    const profileThumb = document.querySelector('.profile-thumb');
    if (!profileThumb) return;

    let isHovering = false;

    const handleMouseMove = throttle((e) => {
        if (!isHovering) return;
        
        const rect = profileContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        profileThumb.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, 16);

    profileContainer.addEventListener('mouseenter', () => {
        isHovering = true;
    }, { passive: true });

    profileContainer.addEventListener('mousemove', handleMouseMove, { passive: true });

    profileContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        profileThumb.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }, { passive: true });
}

// Optimized video hover functionality
function initVideoHovers() {
    const workElements = document.querySelectorAll('.work');
    if (workElements.length === 0) return;

    workElements.forEach((work) => {
        const video = work.querySelector('.video-popup video');
        if (!video) return;

        let hoverTimeout;
        let isHovering = false;

        work.addEventListener('mouseenter', () => {
            isHovering = true;
            hoverTimeout = setTimeout(() => {
                if (isHovering && video.paused) {
                    video.play().catch(() => {
                        // Ignore autoplay errors
                    });
                }
            }, 150);
        }, { passive: true });

        work.addEventListener('mouseleave', () => {
            isHovering = false;
            clearTimeout(hoverTimeout);
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
            }
        }, { passive: true });
    });
}

// Optimized text rotation
function initTextRotation() {
    const el = document.getElementById('rotating-text');
    if (!el) return;

    const texts = ['Software Developer', 'Data Science', 'Machine Learning', 'Web Developer', 'AI Enthusiast', 'Tech Innovator'];
    let idx = 0;
    let isVisible = false;
    let rotationInterval;

    const startRotation = () => {
        if (rotationInterval) return;
        rotationInterval = setInterval(() => {
            if (isVisible) {
                idx = (idx + 1) % texts.length;
                el.textContent = texts[idx];
            }
        }, 2000);
    };

    const stopRotation = () => {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startRotation();
                } else {
                    stopRotation();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(el);
    } else {
        // Fallback for older browsers
        isVisible = true;
        startRotation();
    }
}

// Optimized Spline logo removal
function removeSplineLogos() {
    const splineViewers = document.querySelectorAll('spline-viewer');
    if (splineViewers.length === 0) return;

    const attemptLogoRemoval = () => {
        splineViewers.forEach((viewer) => {
            try {
                if (viewer.shadowRoot) {
                    const logo = viewer.shadowRoot.querySelector('#logo');
                    if (logo) {
                        logo.remove();
                    }
                }
            } catch (error) {
                // Silently ignore errors
            }
        });
    };

    // Try multiple times with increasing delays
    const delays = [1000, 2000, 3000, 5000];
    delays.forEach(delay => {
        setTimeout(attemptLogoRemoval, delay);
    });
}

// Ultra-optimized Spline loader
class SplineOptimizer {
    constructor() {
        this.splineLoaded = false;
        this.observer = null;
        this.loadTimeout = null;
    }

    init() {
        if (!('IntersectionObserver' in window)) return;
        this.setupObserver();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !this.splineLoaded) {
                    clearTimeout(this.loadTimeout);
                    this.loadTimeout = setTimeout(() => {
                        if (entry.isIntersecting) {
                            this.loadSpline();
                        }
                    }, 300);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '50px'
        });

        document.querySelectorAll('spline-viewer').forEach(viewer => {
            this.observer.observe(viewer);
        });
    }

    loadSpline() {
        if (this.splineLoaded) return;
        this.splineLoaded = true;

        if (this.observer) {
            this.observer.disconnect();
        }

        // Minimal loading state
        document.querySelectorAll('spline-viewer').forEach(viewer => {
            viewer.style.opacity = '0.7';
            viewer.style.filter = 'blur(1px)';
            viewer.style.transition = 'all 0.3s ease';
        });

        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.96/build/spline-viewer.js';
        
        script.onload = () => {
            setTimeout(() => {
                document.querySelectorAll('spline-viewer').forEach(viewer => {
                    viewer.style.opacity = '1';
                    viewer.style.filter = 'none';
                });
                // Remove logos after Spline loads
                removeSplineLogos();
            }, 500);
        };

        script.onerror = () => {
            document.querySelectorAll('spline-viewer').forEach(viewer => {
                viewer.style.opacity = '0.3';
                viewer.style.filter = 'none';
            });
        };

        document.head.appendChild(script);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance-optimized features
    initProfileInteraction();
    initVideoHovers();
    initTextRotation();
    
    // Initialize Spline optimizer
    const splineOptimizer = new SplineOptimizer();
    splineOptimizer.init();
});

// Throttle utility function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}