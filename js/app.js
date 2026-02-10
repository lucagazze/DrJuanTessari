/**
 * Doctor Rodilla - Main Logic
 * Handles Interactions, Scroll Animations, Modals and Video
 */

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

    // --- WhatsApp Modal Logic ---
    window.openWhatsAppModal = function() {
        const modal = document.getElementById('whatsappModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeWhatsAppModal = function() {
        const modal = document.getElementById('whatsappModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    // --- Video Modal Logic ---
    document.addEventListener('DOMContentLoaded', () => {
        const videoModal = document.getElementById('video-modal');
        const closeVideo = document.getElementById('close-video');
        const videoContainer = document.getElementById('video-container');
        const heroVideo = document.getElementById('hero-feature-video');
        const modalVideo = document.getElementById('modal-video');

        if (videoModal && closeVideo && videoContainer && heroVideo && modalVideo) {
            let hasOpenedOnce = false;

            const syncToInline = () => {
                heroVideo.currentTime = modalVideo.currentTime;
                heroVideo.muted = false;
                heroVideo.controls = true;
                heroVideo.volume = 1;
                heroVideo.play().catch(console.error);
            };

            const closeModalLogic = () => {
                videoModal.classList.add('opacity-0', 'pointer-events-none');
                videoContainer.classList.add('scale-95');
                videoContainer.classList.remove('scale-100');
                modalVideo.pause();
                document.body.style.overflow = '';
            };

            const startVideoPlayback = () => {
                // Hide overlay permanently
                const overlay = document.getElementById('play-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
                
                // Play in-place with sound and controls
                heroVideo.currentTime = 0;
                heroVideo.muted = false;
                heroVideo.controls = true;
                heroVideo.volume = 1;
                heroVideo.play().catch(console.error);
            };

            // Hero Video Click Handler
            heroVideo.addEventListener('click', (e) => {
                if (heroVideo.controls) return;
                e.preventDefault();
                startVideoPlayback();
            });

            const closeModal = () => {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(console.error);
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                } else {
                    syncToInline();
                    closeModalLogic();
                }
            };

            // Event Listeners
            closeVideo.addEventListener('click', (e) => {
                e.stopPropagation();
                closeModal();
            });

            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) closeModal();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeModal();
            });

            // Fullscreen Change Handlers
            const handleFullscreenChange = () => {
                const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
                if (!isFullscreen && !videoModal.classList.contains('pointer-events-none')) {
                    syncToInline();
                    closeModalLogic();
                }
            };

            const handleIOSFullscreenExit = () => {
                if (!videoModal.classList.contains('pointer-events-none')) {
                    syncToInline();
                    closeModalLogic();
                }
            };

            modalVideo.addEventListener('fullscreenchange', handleFullscreenChange);
            modalVideo.addEventListener('webkitfullscreenchange', handleFullscreenChange);
            modalVideo.addEventListener('webkitendfullscreen', handleIOSFullscreenExit);
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
                
                // Initialize video AFTER page is revealed
                const video = document.getElementById('hero-feature-video');
                if (video) {
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.load(); // Load the new source
                        
                        // Attempt playback
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                                // Autoplay started!
                            }).catch(error => {
                                console.log("Autoplay prevented:", error);
                                video.muted = true;
                                video.play();
                            });
                        }
                    }
                }
            }, 500);
        }
    });

})();
