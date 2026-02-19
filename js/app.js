(function() {
    'use strict';

    // --- DOM Elements ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
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
    document.querySelectorAll('section, .float-card, .testimony-card, .faq-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // --- Wistia Video Tracking ---
    window._wq = window._wq || [];
    window._wq.push({
        id: "wk5lyn8uo5", // Homepage Video ID
        onReady: function(video) {
            video.bind("play", function() {
                if (typeof fbq === 'function') {
                    console.log("Wistia Play Detected: Firing Pixel Event");
                    fbq('trackCustom', 'VideoPlay');
                    // Unbind to only track the first play per session to avoid noise
                    video.unbind("play");
                }
            });
        }
    });

    // --- Window Load Logic (Preloader & Video Init) ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const body = document.body;

        // Fade out preloader
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                body.classList.remove('loading');
            }, 500);
        }
    });

})();
