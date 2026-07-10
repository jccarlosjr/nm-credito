/**
 * NM Crédito — Interactive Web Scripts
 * Vanilla Javascript
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initFaqAccordion();
    initContactForm();
});

/**
 * 1. Header Scroll Effect
 * Adds a border/shadow and shrinks the header when scrolled down.
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    const toggleScrolledClass = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Check on load in case the page is already scrolled
    toggleScrolledClass();
    
    window.addEventListener('scroll', toggleScrolledClass, { passive: true });
}

/**
 * 2. Mobile Menu Toggle
 * Opens and closes the overlay menu on mobile screens.
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!toggleBtn || !navMenu) return;
    
    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        
        // Change menu icon between hamburger and close (X)
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            if (isOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            if (window.lucide) window.lucide.createIcons();
        }
    };
    
    toggleBtn.addEventListener('click', toggleMenu);
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/**
 * 4. FAQ Accordion
 * Handles showing and hiding answers in the FAQ section.
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        if (!questionBtn) return;
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const btn = otherItem.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
            
            // If the clicked item was not active, open it
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}



/**
 * 6. Contact Form integration
 * Captures form inputs and shows a success notification on screen.
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando solicitação...';
        
        // Prepare the FormSubmit payload
        const formData = {
            Nome: document.getElementById('formName').value,
            Telefone: document.getElementById('formPhone').value,
            Modalidade: document.getElementById('formOption').value,
            Mensagem: document.getElementById('formMessage').value || 'Nenhuma mensagem adicional.',
            _subject: 'Nova Simulação de Crédito - NM Crédito',
            _captcha: 'false'
        };

        // Submit to FormSubmit's AJAX endpoint
        fetch('https://formsubmit.co/ajax/nmcredito@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha no envio');
            }
            return response.json();
        })
        .then(data => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Render a modern, inline success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.backgroundColor = 'var(--color-accent-light)';
            successDiv.style.color = 'var(--color-accent)';
            successDiv.style.padding = '16px';
            successDiv.style.borderRadius = 'var(--border-radius-sm)';
            successDiv.style.marginTop = '16px';
            successDiv.style.fontWeight = '600';
            successDiv.style.fontSize = '14px';
            successDiv.style.textAlign = 'center';
            successDiv.innerHTML = '<i data-lucide="check-circle" style="display:inline-block; vertical-align:middle; margin-right:8px; width:18px; height:18px;"></i> Solicitação enviada com sucesso! Entraremos em contato.';
            
            // Append success message after the form and reset inputs
            contactForm.appendChild(successDiv);
            if (window.lucide) window.lucide.createIcons();
            contactForm.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        })
        .catch(error => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Render a modern, inline error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.backgroundColor = '#fee2e2';
            errorDiv.style.color = '#dc2626';
            errorDiv.style.padding = '16px';
            errorDiv.style.borderRadius = 'var(--border-radius-sm)';
            errorDiv.style.marginTop = '16px';
            errorDiv.style.fontWeight = '600';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.textAlign = 'center';
            errorDiv.innerHTML = '<i data-lucide="alert-triangle" style="display:inline-block; vertical-align:middle; margin-right:8px; width:18px; height:18px;"></i> Ocorreu um erro ao enviar. Tente novamente ou fale conosco.';
            
            contactForm.appendChild(errorDiv);
            if (window.lucide) window.lucide.createIcons();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        });
    });
}
