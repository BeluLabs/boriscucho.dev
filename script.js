
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

// IMPORTANTE: Reemplaza esta URL con tu Discord Webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1429174354486366328/ivcfUBvqJxV1ld4FQPjXS-hLGkmjuaH3uvqoC5bNiYUw0JamkcXqmpE3dC8pH5ZvnvxG';

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
            // Crear el mensaje embed para Discord
            const discordMessage = {
                embeds: [{
                    title: '📬 Nuevo mensaje de contacto',
                    color: 3447003, // Color azul
                    fields: [
                        {
                            name: '👤 Nombre',
                            value: name,
                            inline: true
                        },
                        {
                            name: '📧 Email',
                            value: email,
                            inline: true
                        },
                        {
                            name: '💬 Mensaje',
                            value: message,
                            inline: false
                        }
                    ],
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: 'Formulario de contacto - boriscucho.dev'
                    }
                }]
            };
            
            // Enviar a Discord
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(discordMessage)
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
