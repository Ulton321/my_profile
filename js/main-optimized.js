(function() {
    'use strict';

    const optimizer = window.MainThreadOptimizer;
    
    // Critical functions that run immediately
    const criticalInit = function() {
        // Loader removal
        $('.fh5co-loader').fadeOut('slow');
        
        // Essential mobile navigation
        $('.js-fh5co-nav-toggle').on('click', function() {
            $(this).toggleClass('active');
        });
    };

    // Non-critical functions scheduled with optimizer
    const initAnimations = function() {
        return new Promise(resolve => {
            if ($('.animate-box').length > 0) {
                $('.animate-box').waypoint(function(direction) {
                    if (direction === 'down' && !$(this.element).hasClass('animated')) {
                        $(this.element).addClass('item-animate');
                        setTimeout(() => {
                            $(this.element).addClass('fadeInUp animated');
                        }, 50);
                    }
                }, { offset: '85%' });
            }
            resolve();
        });
    };

    const initCounters = function() {
        return new Promise(resolve => {
            if ($('.js-counter').length > 0) {
                $('.js-counter').countTo({
                    formatter: function(value, options) {
                        return value.toFixed(options.decimals);
                    }
                });
            }
            resolve();
        });
    };

    const initSkills = function() {
        return new Promise(resolve => {
            if ($('.fh5co-skills').length > 0) {
                $('.fh5co-skills').waypoint(function(direction) {
                    $('.progress .progress-bar').each(function() {
                        $(this).css('width', $(this).attr('aria-valuenow') + '%');
                    });
                }, { offset: '90%' });
            }
            resolve();
        });
    };

    // Initialize critical features immediately
    $(document).ready(criticalInit);

    // Schedule non-critical features
    $(window).on('load', function() {
        // Wait for main thread to be less busy
        setTimeout(() => {
            if (optimizer) {
                optimizer.scheduleTask(initAnimations);
                optimizer.deferTask(initCounters, 500);
                optimizer.deferTask(initSkills, 1000);
            }
        }, 100);
    });

})();