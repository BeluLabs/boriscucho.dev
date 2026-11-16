// Año del footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ====================================
// Formulario de contacto -> Cloudflare Worker -> Discord
// ====================================

const CONTACT_ENDPOINT = 'https://contact.boriscucho.workers.dev';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function setStatus(text, type) {
    formStatus.textContent = text;
    formStatus.classList.remove('success', 'error');
    if (type) formStatus.classList.add(type);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(contactForm));

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setStatus('');

        try {
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    website: data.website, // honeypot
                }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setStatus('✓ Message sent successfully!', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('✗ Error sending message. Please try again or contact me directly via email.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
        }
    });
}
