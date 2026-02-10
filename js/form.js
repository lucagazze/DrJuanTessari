/**
 * Doctor Rodilla - Form Logic
 * Handles Form Selection, Steps, and WhatsApp Integration
 */

(function() {
    'use strict';

    // State
    let selectedSede = '';
    const stepMethod = document.getElementById('step-method');
    const stepLocation = document.getElementById('step-location');
    const stepForm = document.getElementById('step-form');
    const sedeLabel = document.getElementById('sede-label');
    const inputName = document.getElementById('inputName');
    const inputPain = document.getElementById('inputPain');
    const inputDesc = document.getElementById('inputDesc');
    const whatsappForm = document.getElementById('whatsappForm');

    // Make functions available globally for HTML onclick handlers
    window.showMethodSelection = function() {
        if(stepForm) stepForm.classList.add('hidden');
        if(stepLocation) stepLocation.classList.add('hidden');
        if(stepMethod) stepMethod.classList.remove('hidden');
        selectedSede = '';
    };

    window.showLocationSelection = function() {
        if(stepMethod) stepMethod.classList.add('hidden');
        if(stepForm) stepForm.classList.add('hidden');
        if(stepLocation) stepLocation.classList.remove('hidden');
    };

    // Direct path for VideoConsulta
    window.selectVideoconsulta = function() {
        selectedSede = 'Videoconsulta (Online)';
        showForm();
    };

    // Path for Consultorio
    window.selectLocation = function(locationName) {
        selectedSede = locationName;
        showForm();
    };

    function showForm() {
        if(stepMethod) stepMethod.classList.add('hidden');
        if(stepLocation) stepLocation.classList.add('hidden');
        if(stepForm) stepForm.classList.remove('hidden');
        
        // Update Label
        if(sedeLabel) sedeLabel.innerText = `MODALIDAD: ${selectedSede}`;
    }

    window.showBackFromForm = function() {
        if (selectedSede === 'Videoconsulta (Online)') {
            window.showMethodSelection();
        } else {
            window.showLocationSelection();
        }
    };

    window.handleSubmit = function(event) {
        event.preventDefault();
        
        const btn = event.target.querySelector('button');
        const originalText = btn.innerHTML;
        
        const name = inputName.value;
        const pain = inputPain.value;
        const desc = inputDesc.value;
        
        // --- CONFIGURE WHATSAPP NUMBER HERE ---
        const whatsappNumber = "5491155914232"; // Actual number provided by user
        // --------------------------------------

        let message = `SOLICITUD DE TURNO 👋\n\n`;
        message += `Nombre: ${name}\n`;
        message += `----------------------------------\n`;
        message += `Sede/Modalidad: ${selectedSede}\n`;
        message += `Zona de dolor: ${pain}\n`;
        if(desc) message += `Comentarios: ${desc}\n`;

        const encodedMessage = encodeURIComponent(message);
        // Use api.whatsapp.com for more reliable deep linking on some devices
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

        // Loading state
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Abriendo...';
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        // Open immediately to avoid popup blockers
        window.open(whatsappUrl, '_blank');
        
        // Reset Button State after a short delay
        setTimeout(() => {
            btn.disabled = false;
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            btn.innerHTML = originalText;
        }, 3000);
    };

    // Fix for mobile keyboard layout shift
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            // Check if focus moved to another input in our form
            // We use a small timeout because activeElement might not update instantly in all browsers
            setTimeout(() => {
                const activeEl = document.activeElement;
                const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA';
                
                // Only scroll to top if we are NOT focusing another field
                if (!isInput) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 200); // Increased slightly to allow keyboard animation to finish
        });
    });

})();
