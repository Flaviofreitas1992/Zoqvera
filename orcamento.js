const quoteForm = document.querySelector('#quote-form');
const quoteStatus = document.querySelector('#quote-status');
const quoteService = document.querySelector('#quote-service');
const ZOQVERA_WHATSAPP = '5521984193930';

const serviceFromUrl = new URLSearchParams(window.location.search).get('servico');
if (serviceFromUrl && quoteService) {
  const matchingOption = Array.from(quoteService.options).find((option) => option.value === serviceFromUrl);
  if (matchingOption) quoteService.value = serviceFromUrl;
}

quoteStatus?.setAttribute('role', 'status');
quoteStatus?.setAttribute('aria-live', 'polite');

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) {
    const firstInvalid = quoteForm.querySelector(':invalid');
    if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
    if (quoteStatus) quoteStatus.textContent = 'Revise os campos obrigatórios destacados antes de continuar.';
    return;
  }

  const data = new FormData(quoteForm);
  const field = (name) => String(data.get(name) || '').trim();

  const message = [
    'Olá! Gostaria de solicitar um orçamento para um projeto com a Zoqvera.',
    '',
    '*DADOS INICIAIS*',
    `Nome: ${field('name')}`,
    `WhatsApp: ${field('phone')}`,
    ...(field('email') ? [`E-mail: ${field('email')}`] : []),
    '',
    `Serviço de interesse: ${field('service')}`,
    '',
    '*O que preciso resolver:*',
    field('problem')
  ].join('\n');

  const whatsappUrl = `https://wa.me/${ZOQVERA_WHATSAPP}?text=${encodeURIComponent(message)}`;
  const submitButton = quoteForm.querySelector('button[type="submit"]');

  quoteForm.setAttribute('aria-busy', 'true');
  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-disabled', 'true');
  }

  if (quoteStatus) {
    quoteStatus.textContent = 'Mensagem preparada. Abrindo o WhatsApp para você revisar e decidir se deseja enviar.';
  }

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  window.setTimeout(() => {
    quoteForm.removeAttribute('aria-busy');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-disabled');
    }
  }, 1200);
});
