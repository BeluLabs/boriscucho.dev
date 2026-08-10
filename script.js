
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

// ====================================
// Discord Webhook - Formulario de Contacto
// ====================================

// URL del Cloudflare Worker que reenvía el mensaje a Discord.
const CONTACT_ENDPOINT = 'https://contact.boriscucho.workers.dev';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Deshabilitar el botón mientras se envía
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.style.color = '';
        
        try {
            // Enviar al Worker, que reenvía el mensaje a Discord
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                // Éxito
                formStatus.textContent = '✓ Message sent successfully!';
                formStatus.style.color = 'green';
                contactForm.reset();
            } else {
                throw new Error('Error al enviar el mensaje');
            }
        } catch (error) {
            // Error
            console.error('Error:', error);
            formStatus.textContent = '✗ Error sending message. Please try again or contact me directly via email.';
            formStatus.style.color = 'red';
        } finally {
            // Rehabilitar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send';
        }
    });
}
