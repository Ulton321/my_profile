class ProgressiveLoader {
    constructor() {
        this.loadedModules = new Set();
        this.criticalJSLoaded = false;
    }

    async loadCriticalJS() {
        if (this.criticalJSLoaded) return;
        
        // Load only essential JS for initial interaction
        await this.loadScript('js/jquery.min.js');
        
        // Initialize critical functionality
        this.initCriticalFeatures();
        this.criticalJSLoaded = true;
    }

    async loadNonCriticalJS() {
        const scripts = [
            { src: 'js/jquery.easing.1.3.js', priority: 'high' },
            { src: 'js/bootstrap.min.js', priority: 'medium' },
            { src: 'js/jquery.waypoints.min.js', priority: 'low' },
            { src: 'js/jquery.stellar.min.js', priority: 'low' },
            { src: 'js/jquery.easypiechart.min.js', priority: 'low' }
        ];

        // Load high priority scripts first
        for (const script of scripts.filter(s => s.priority === 'high')) {
            await this.loadScript(script.src);
        }

        // Load medium priority scripts with delay
        setTimeout(async () => {
            for (const script of scripts.filter(s => s.priority === 'medium')) {
                await this.loadScript(script.src);
            }
        }, 500);

        // Load low priority scripts when idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(async () => {
                for (const script of scripts.filter(s => s.priority === 'low')) {
                    await this.loadScript(script.src);
                }
            });
        } else {
            setTimeout(async () => {
                for (const script of scripts.filter(s => s.priority === 'low')) {
                    await this.loadScript(script.src);
                }
            }, 2000);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedModules.has(src)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => {
                this.loadedModules.add(src);
                resolve();
            };
            
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initCriticalFeatures() {
        // Initialize only essential features
        $(document).ready(function() {
            // Mobile menu toggle (essential for mobile users)
            $('.js-fh5co-nav-toggle').on('click', function() {
                $(this).toggleClass('active');
                $('.fh5co-nav').toggleClass('active');
            });

            // Smooth scrolling for navigation
            $('a[href*="#"]').on('click', function(e) {
                e.preventDefault();
                const target = $(this.getAttribute('href'));
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 70
                    }, 1000);
                }
            });
        });
    }
}

window.ProgressiveLoader = new ProgressiveLoader();