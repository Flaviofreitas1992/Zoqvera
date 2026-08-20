const quoteForm = document.querySelector('#quote-form');
const quoteStatus = document.querySelector('#quote-status');
const quoteService = document.querySelector('#quote-service');
const ZOQVERA_WHATSAPP = '5521984193930';

const serviceFromUrl = new URLSearchParams(window.location.search).get('servico');
if (serviceFromUrl && quoteService) {
  const matchingOption = Array.from(quoteService.options).find((option) => option.value === serviceFromUrl);
  if (matchingOption) quoteService.value = serviceFromUrl;
}

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
  const field = (name) => String(data.get(name) || '').trim();

  const message = [
    'Olá! Gostaria de solicitar um orçamento para um projeto com a Zoqvera.',
    '',
    '*BRIEFING DO PROJETO*',
    `Nome: ${field('name')}`,
    `Empresa/projeto: ${field('company') || 'Não informado'}`,
    `E-mail: ${field('email')}`,
    `WhatsApp: ${field('phone')}`,
    '',
    `Serviço: ${field('service')}`,
    `Estágio atual: ${field('stage')}`,
    `Prazo desejado: ${field('timeline')}`,
    '',
    '*Problema que quero resolver:*',
    field('problem'),
    '',
    '*Funcionalidades/entregas essenciais:*',
    field('features') || 'Ainda não definidas',
    '',
    `Site ou referência atual: ${field('reference') || 'Não informado'}`,
    '',
    '*Observações adicionais:*',
    field('notes') || 'Nenhuma'
  ].join('\n');

  const whatsappUrl = `https://wa.me/${ZOQVERA_WHATSAPP}?text=${encodeURIComponent(message)}`;

  if (quoteStatus) {
    quoteStatus.textContent = 'Briefing preparado. Abrindo o WhatsApp para você revisar e enviar a mensagem.';
    quoteStatus.setAttribute('role', 'status');
  }

  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});