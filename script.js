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
