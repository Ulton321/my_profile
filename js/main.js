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

	
	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};



	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};

	var pieChart = function() {
		$('.chart').easyPieChart({
			scaleColor: false,
			lineWidth: 4,
			lineCap: 'butt',
			barColor: '#FF9000',
			trackColor:	"#f5f5f5",
			size: 160,
			animate: 1000
		});
	};

	var skillsWayPoint = function() {
		if ($('#fh5co-skills').length > 0 ) {
			$('#fh5co-skills').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( pieChart , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}

	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	
	$(function(){
		contentWayPoint();
		goToTop();
		loaderPage();
		fullHeight();
		parallax();
		// pieChart();
		skillsWayPoint();
	});


}());


document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        profileContainer.addEventListener('mousemove', (e) => {
            const profileThumb = document.querySelector('.profile-thumb');
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X position within the element
            const y = e.clientY - rect.top;  // Mouse Y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10; // Adjust sensitivity
            const rotateY = (centerX - x) / 10;

            profileThumb.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        profileContainer.addEventListener('mouseleave', () => {
            const profileThumb = document.querySelector('.profile-thumb');
            profileThumb.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
});


document.querySelectorAll('.work').forEach((work) => {
    const video = work.querySelector('.video-popup video');

    work.addEventListener('mouseenter', () => {
        video.play();
    });

    work.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Reset the video to the beginning
    });
});




window.onload = function() {
	var shadowRoot = document.querySelector('spline-viewer').shadowRoot;
	shadowRoot.querySelector('#logo').remove();
}


window.onload = function() {
    const splineViewers = document.querySelectorAll('spline-viewer');
    splineViewers.forEach((viewer) => {
        const shadowRoot = viewer.shadowRoot;
        const logo = shadowRoot.querySelector('#logo');
        if (logo) {
            logo.remove(); // Remove the "Build with Spline" logo
        }
    });
};



// text rotating 

const words = [
  'Software Developer',
  'Cyber Security Enthusiast',
  'AI Researcher',
  'Full Stack Engineer'
];
let idx = 0;
const el = document.getElementById('rotating-text');

function animateLetters(word) {
  el.innerHTML = ''; // Clear previous
  const wordSpan = document.createElement('span');
  wordSpan.className = 'text-rotate-word show';
  // Add each letter as a span
  [...word].forEach((char, i) => {
    const letter = document.createElement('span');
    letter.className = 'text-rotate-letter';
    letter.textContent = char;
    wordSpan.appendChild(letter);
    // Animate each letter with a staggered delay
    setTimeout(() => {
      letter.classList.add('show');
    }, i * 60); // 60ms per letter
  });
  el.appendChild(wordSpan);
}

let interval = setInterval(() => {
  idx = (idx + 1) % words.length;
  animateLetters(words[idx]);
}, 2500);

// Initialize first word
animateLetters(words[0]);