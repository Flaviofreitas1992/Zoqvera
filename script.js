const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const reveals = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('#form-note');
const year = document.querySelector('#year');

const WHATSAPP_NUMBER = '5521984193930';

if (year) year.textContent = new Date().getFullYear();

const civicaProjectLink = document.querySelector('.project-civica .project-link');
if (civicaProjectLink) {
  civicaProjectLink.href = 'portfolio/civica.html';
  civicaProjectLink.removeAttribute('target');
  civicaProjectLink.removeAttribute('rel');
  civicaProjectLink.setAttribute('aria-label', 'Ver case da Plataforma Cívica');

  const civicaProjectCta = civicaProjectLink.querySelector('.project-cta');
  if (civicaProjectCta) civicaProjectCta.textContent = 'Ver case →';
}

if (formNote) {
  formNote.textContent = 'Ao enviar, abriremos o WhatsApp da Zoqvera com os dados do seu projeto.';
}

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach((element) => observer.observe(element));

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const whatsappMessage = [
    'Olá! Entrei em contato pelo site da Zoqvera.',
    '',
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Projeto: ${message}`
  ].join('\n');

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  if (formNote) {
    formNote.textContent = 'Abrindo o WhatsApp para enviar os dados do seu projeto...';
    formNote.setAttribute('role', 'status');
  }

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});

const floatingWhatsappMessage = 'Olá! Conheci a Zoqvera pelo site e gostaria de conversar sobre um projeto.';
const floatingWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(floatingWhatsappMessage)}`;

const floatingWhatsapp = document.createElement('a');
floatingWhatsapp.className = 'whatsapp-float';
floatingWhatsapp.href = floatingWhatsappUrl;
floatingWhatsapp.target = '_blank';
floatingWhatsapp.rel = 'noopener noreferrer';
floatingWhatsapp.setAttribute('aria-label', 'Falar com a Zoqvera pelo WhatsApp');
floatingWhatsapp.innerHTML = `
  <svg class="whatsapp-float-icon" viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M16.04 3C9.42 3 4.05 8.25 4.05 14.73c0 2.28.67 4.51 1.94 6.41L4 28.2l7.32-1.91a12.13 12.13 0 0 0 4.71.94h.01c6.61 0 12-5.26 12-11.73C28.04 9 22.65 3 16.04 3Zm0 21.91h-.01a9.86 9.86 0 0 1-4.99-1.35l-.36-.21-4.34 1.13 1.16-4.13-.24-.38a9.38 9.38 0 0 1-1.5-5.24c0-5.21 4.6-9.45 10.27-9.45 5.66 0 10.27 4.24 10.27 9.45 0 5.22-4.61 10.18-10.26 10.18Zm5.63-7.08c-.31-.15-1.82-.88-2.1-.98-.28-.1-.49-.15-.69.15-.2.3-.8.98-.98 1.18-.18.2-.36.22-.67.07-.31-.15-1.3-.47-2.48-1.49-.92-.8-1.53-1.79-1.71-2.09-.18-.3-.02-.46.13-.61.14-.13.31-.35.46-.53.15-.18.2-.3.31-.5.1-.2.05-.38-.03-.53-.08-.15-.69-1.63-.95-2.23-.25-.6-.5-.52-.69-.53h-.59c-.2 0-.54.08-.82.38-.28.3-1.08 1.03-1.08 2.51 0 1.48 1.1 2.91 1.25 3.11.15.2 2.16 3.24 5.23 4.54.73.31 1.3.49 1.75.63.73.23 1.4.2 1.93.12.59-.09 1.82-.73 2.08-1.43.26-.7.26-1.3.18-1.43-.08-.13-.28-.2-.59-.35Z"/>
  </svg>
  <span>Fale no WhatsApp</span>
`;

document.body.appendChild(floatingWhatsapp);

const floatingWhatsappStyles = document.createElement('style');
floatingWhatsappStyles.textContent = `
  .whatsapp-float {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 999;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 54px;
    padding: 0 18px 0 14px;
    border-radius: 999px;
    background: #25d366;
    color: #07140c;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
    font-weight: 800;
    text-decoration: none;
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255,255,255,0.12) inset;
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
  }

  .whatsapp-float:hover {
    transform: translateY(-3px);
    background: #2ee06f;
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(255,255,255,0.16) inset;
  }

  .whatsapp-float:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
  }

  .whatsapp-float-icon {
    width: 26px;
    height: 26px;
    flex: 0 0 auto;
  }

  @media (max-width: 640px) {
    .whatsapp-float {
      right: 16px;
      bottom: 16px;
      width: 56px;
      height: 56px;
      min-height: 56px;
      padding: 0;
      justify-content: center;
    }

    .whatsapp-float span {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .whatsapp-float-icon {
      width: 29px;
      height: 29px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .whatsapp-float {
      transition: none;
    }
  }
`;

document.head.appendChild(floatingWhatsappStyles);
