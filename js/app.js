/**
 * Doctor Rodilla - Main Logic
 * Handles Interactions, Form Validation, and Scroll Animations
 */

(function() {
    'use strict';

    // --- DOM Elements ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // --- Video Logic ---
    const videoContainer = document.getElementById('videoContainer');
    const heroVideo = document.getElementById('heroVideo');
    const videoOverlay = document.getElementById('videoOverlay');

    if (videoContainer && heroVideo && videoOverlay) {
        // Attempt autoplay immediately (muted)
        heroVideo.play().catch(e => {
            console.log('Autoplay blocked:', e);
            // If autoplay is blocked, show a "click to play" indicator logic (handled by our overlay essentially)
        });

        // Click handler
        const activatingVideo = () => {
             // Only activate if not already activated (we check controls to know state)
             if (!heroVideo.controls) {
                heroVideo.muted = false;
                heroVideo.currentTime = 0;
                heroVideo.controls = true;
                heroVideo.loop = false;
                
                // Hide overlay
                videoOverlay.style.opacity = '0';
                setTimeout(() => {
                    videoOverlay.style.display = 'none';
                }, 300);

                // Enhance visibility
                heroVideo.classList.remove('opacity-80', 'group-hover:opacity-60');
                heroVideo.classList.add('opacity-100');
                
                heroVideo.play();

                // Remove listener so native controls work without interference
                videoContainer.removeEventListener('click', activatingVideo);
             }
        };

        videoContainer.addEventListener('click', activatingVideo);
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    // Select elements to animate
    // We add the 'reveal' class to sections/elements we want to animate
    document.querySelectorAll('section, .float-card, .testimony-card, .faq-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });


    // --- Form Validation & Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic Native Validation Check
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            // Lock UI
            const originalText = submitBtn ? submitBtn.innerText : 'Enviar';
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Enviando...';
            }

            // Simulate Network Request
            setTimeout(() => {
                // Success State
                if(submitBtn) {
                    submitBtn.innerText = '¡Enviado con Éxito!';
                    submitBtn.style.backgroundColor = 'var(--color-whatsapp)';
                }
                contactForm.reset();

                // Reset after 3 seconds
                setTimeout(() => {
                    if(submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalText;
                        submitBtn.style.backgroundColor = '';
                    }
                }, 3000);
            }, 1000);
        });
    }

    // --- Interactive Infinite Carousel (Mobile) ---
    const carousel = document.getElementById('mobileStatsCarousel');
    if (carousel) {
        let isPaused = false;
        let animationId;
        const speed = 0.5; // Adjust for smoothness

        // Infinite Loop Logic
        const autoScroll = () => {
            if (!isPaused) {
                // Determine the midpoint (end of first set)
                // We assume duplicates are exact copies, so standard content is half of scrollWidth
                const maxScroll = carousel.scrollWidth / 2;
                
                carousel.scrollLeft += speed;

                // Reset to start if we pass the midpoint (seamless loop)
                // Note: using >= checks if we've scrolled past the first set
                if (carousel.scrollLeft >= maxScroll) {
                   carousel.scrollLeft = 0; // Jump back to start instantly
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        };

        // Start Animation
        animationId = requestAnimationFrame(autoScroll);

        // Pause on User Interaction (Touch or Hover)
        carousel.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
        carousel.addEventListener('touchend', () => { isPaused = false; });
        carousel.addEventListener('mouseenter', () => { isPaused = true; });
        carousel.addEventListener('mouseleave', () => { isPaused = false; });
    }

})();
