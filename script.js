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

const homeQuoteCta = document.querySelector('.nav-cta');
if (homeQuoteCta) {
  homeQuoteCta.href = 'solicitar-orcamento.html';
  homeQuoteCta.textContent = 'Solicitar orçamento';
}

const serviceQuoteByPage = {
  'sites-landing-pages.html': 'Sites e Landing Pages',
  'software-sob-medida.html': 'Software sob medida',
  'plataformas-digitais.html': 'Plataformas Digitais',
  'solucoes-de-ia.html': 'Soluções de IA',
  'evolucao-manutencao.html': 'Evolução e Manutenção'
};

const serviceNavCta = document.querySelector('.service-nav-cta');
if (serviceNavCta) {
  const currentPage = window.location.pathname.split('/').pop();
  const selectedService = serviceQuoteByPage[currentPage];
  const query = selectedService ? `?servico=${encodeURIComponent(selectedService)}` : '';
  serviceNavCta.href = `../solicitar-orcamento.html${query}`;
  serviceNavCta.textContent = 'Solicitar orçamento';
}

const serviceCards = document.querySelectorAll('.service-card');
const servicePageLinks = [
  ['servicos/sites-landing-pages.html', 'Conhecer o serviço de sites institucionais'],
  ['servicos/sites-landing-pages.html', 'Conhecer o serviço de landing pages'],
  ['servicos/software-sob-medida.html', 'Conhecer o serviço de software sob medida'],
  ['servicos/plataformas-digitais.html', 'Conhecer o serviço de plataformas digitais'],
  ['servicos/solucoes-de-ia.html', 'Conhecer o serviço de soluções de inteligência artificial'],
  ['servicos/evolucao-manutencao.html', 'Conhecer o serviço de evolução, manutenção e modernização']
];

serviceCards.forEach((card, index) => {
  const config = servicePageLinks[index];
  if (!config || card.querySelector('.service-card-link')) return;
  const link = document.createElement('a');
  link.className = 'service-card-link';
  link.href = config[0];
  link.setAttribute('aria-label', config[1]);
  while (card.firstChild) link.appendChild(card.firstChild);
  card.appendChild(link);
});

if (serviceCards.length) {
  const styles = document.createElement('style');
  styles.textContent = '.service-card-link{display:block;height:100%;color:inherit;text-decoration:none}.service-card-link:focus-visible{outline:3px solid #1e7047;outline-offset:-5px;border-radius:4px}';
  document.head.appendChild(styles);
}

[
  ['.project-civica .project-link', 'portfolio/civica.html', 'Ver case da Plataforma Cívica'],
  ['.project-teacher .project-link', 'portfolio/teacher-flavius.html', 'Ver case do Teacher Flavius'],
  ['.project-cleiton .project-link', 'portfolio/cleiton-rodrigues.html', 'Ver case do Cleiton Rodrigues']
].forEach(([selector, href, label]) => {
  const link = document.querySelector(selector);
  if (!link) return;
  link.href = href;
  link.removeAttribute('target');
  link.removeAttribute('rel');
  link.setAttribute('aria-label', label);
  const cta = link.querySelector('.project-cta');
  if (cta) cta.textContent = 'Ver case →';
});

if (formNote) {
  formNote.textContent = 'Ao enviar, abriremos o WhatsApp da Zoqvera com os dados do seu projeto.';
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open');
  document.body.classList.toggle('menu-open', Boolean(isOpen));
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
}));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const text = ['Olá! Entrei em contato pelo site da Zoqvera.', '', `Nome: ${name}`, `E-mail: ${email}`, `Projeto: ${message}`].join('\n');
  if (formNote) {
    formNote.textContent = 'Abrindo o WhatsApp para enviar os dados do seu projeto...';
    formNote.setAttribute('role', 'status');
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
});

const floatingMessage = 'Olá! Conheci a Zoqvera pelo site e gostaria de conversar sobre um projeto.';
const floatingWhatsapp = document.createElement('a');
floatingWhatsapp.className = 'whatsapp-float';
floatingWhatsapp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(floatingMessage)}`;
floatingWhatsapp.target = '_blank';
floatingWhatsapp.rel = 'noopener noreferrer';
floatingWhatsapp.setAttribute('aria-label', 'Falar com a Zoqvera pelo WhatsApp');
floatingWhatsapp.innerHTML = '<span class="whatsapp-float-icon" aria-hidden="true">↗</span><span>Fale no WhatsApp</span>';
document.body.appendChild(floatingWhatsapp);

const floatingStyles = document.createElement('style');
floatingStyles.textContent = `
.whatsapp-float{position:fixed;right:24px;bottom:24px;z-index:999;display:inline-flex;align-items:center;gap:10px;min-height:54px;padding:0 18px 0 14px;border-radius:999px;background:#25d366;color:#07140c;font-family:'Manrope',sans-serif;font-size:14px;font-weight:800;text-decoration:none;box-shadow:0 14px 35px rgba(0,0,0,.28);transition:transform 180ms ease,background 180ms ease}
.whatsapp-float:hover{transform:translateY(-3px);background:#2ee06f}
.whatsapp-float:focus-visible{outline:3px solid #fff;outline-offset:3px}
.whatsapp-float-icon{width:26px;height:26px;display:grid;place-items:center;border:2px solid currentColor;border-radius:50%;font-size:15px}
@media(max-width:640px){.whatsapp-float{right:16px;bottom:16px;width:56px;height:56px;min-height:56px;padding:0;justify-content:center}.whatsapp-float>span:last-child{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}}
@media(prefers-reduced-motion:reduce){.whatsapp-float{transition:none}}
`;
document.head.appendChild(floatingStyles);

// SEO técnico centralizado. Enquanto o domínio próprio não estiver ativo,
// as URLs canônicas usam o endereço atual do GitHub Pages.
const SEO_BASE_URL = 'https://flaviofreitas1992.github.io/Zoqvera';
const currentPathname = window.location.pathname;
const repositoryPrefix = '/Zoqvera/';
const relativeSeoPath = currentPathname.startsWith(repositoryPrefix)
  ? currentPathname.slice(repositoryPrefix.length)
  : currentPathname.replace(/^\/+/, '');
const seoPagePath = !relativeSeoPath || relativeSeoPath === 'index.html' ? 'index.html' : relativeSeoPath;

const seoPages = {
  'index.html': {
    kind: 'website',
    name: 'Zoqvera — Desenvolvimento Web, Software e IA',
    description: 'A Zoqvera desenvolve sites, landing pages, softwares, plataformas e soluções de inteligência artificial sob medida.'
  },
  'servicos/sites-landing-pages.html': {
    kind: 'service',
    name: 'Sites e Landing Pages',
    description: 'Criação de sites institucionais e landing pages responsivas, claras e orientadas à conversão para profissionais e empresas.'
  },
  'servicos/software-sob-medida.html': {
    kind: 'service',
    name: 'Software sob medida',
    description: 'Desenvolvimento de sistemas e softwares web sob medida para organizar operações, automatizar processos e conectar dados, pagamentos e usuários.'
  },
  'servicos/plataformas-digitais.html': {
    kind: 'service',
    name: 'Plataformas Digitais',
    description: 'Desenvolvimento de plataformas digitais, portais e aplicações web com autenticação, dados, painéis, fluxos e integrações sob medida.'
  },
  'servicos/solucoes-de-ia.html': {
    kind: 'service',
    name: 'Soluções de IA',
    description: 'Soluções de inteligência artificial conectadas a dados e processos reais: assistentes, análise, automação e funcionalidades inteligentes sob medida.'
  },
  'servicos/evolucao-manutencao.html': {
    kind: 'service',
    name: 'Evolução, Manutenção e Modernização',
    description: 'Evolução contínua de sites, sistemas e plataformas com novas funcionalidades, correções, performance, segurança e modernização técnica.'
  },
  'portfolio/civica.html': {
    kind: 'case',
    name: 'Case Plataforma Cívica — Zoqvera',
    description: 'Case de uma plataforma orientada a dados para apoiar análise e comparação de políticas públicas com metodologia auditável.'
  },
  'portfolio/teacher-flavius.html': {
    kind: 'case',
    name: 'Case Teacher Flavius — Zoqvera',
    description: 'Case de um ecossistema web educacional com área do estudante, gestão acadêmica, pagamentos e automações.'
  },
  'portfolio/cleiton-rodrigues.html': {
    kind: 'case',
    name: 'Case Cleiton Rodrigues — Zoqvera',
    description: 'Case de uma landing page profissional para psicologia e psicanálise com posicionamento, experiência responsiva e conversão para WhatsApp.'
  },
  'solicitar-orcamento.html': {
    kind: 'conversion',
    name: 'Solicitar orçamento — Zoqvera',
    description: 'Briefing inicial para solicitar avaliação de um projeto digital com a Zoqvera.',
    noindex: true
  }
};

const seoPage = seoPages[seoPagePath];
if (seoPage) {
  const canonicalUrl = seoPagePath === 'index.html'
    ? `${SEO_BASE_URL}/`
    : `${SEO_BASE_URL}/${seoPagePath}`;

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  let robotsMeta = document.querySelector('meta[name="robots"]');
  if (!robotsMeta) {
    robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    document.head.appendChild(robotsMeta);
  }
  robotsMeta.content = seoPage.noindex
    ? 'noindex,follow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  const organization = {
    '@type': 'Organization',
    '@id': `${SEO_BASE_URL}/#organization`,
    name: 'Zoqvera',
    url: `${SEO_BASE_URL}/`,
    description: 'Desenvolvimento web, software, plataformas e soluções de inteligência artificial sob medida.',
    logo: `${SEO_BASE_URL}/favicon.ico`,
    image: `${SEO_BASE_URL}/og-image-v2.jpg`
  };

  let pageEntity;
  if (seoPage.kind === 'service') {
    pageEntity = {
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: seoPage.name,
      description: seoPage.description,
      url: canonicalUrl,
      provider: { '@id': `${SEO_BASE_URL}/#organization` }
    };
  } else if (seoPage.kind === 'case') {
    pageEntity = {
      '@type': 'CreativeWork',
      '@id': `${canonicalUrl}#case`,
      name: seoPage.name,
      description: seoPage.description,
      url: canonicalUrl,
      inLanguage: 'pt-BR',
      creator: { '@id': `${SEO_BASE_URL}/#organization` }
    };
  } else {
    pageEntity = {
      '@type': seoPage.kind === 'website' ? 'WebSite' : 'WebPage',
      '@id': seoPage.kind === 'website' ? `${SEO_BASE_URL}/#website` : `${canonicalUrl}#webpage`,
      name: seoPage.name,
      description: seoPage.description,
      url: canonicalUrl,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SEO_BASE_URL}/#organization` }
    };
  }

  document.querySelectorAll('script[data-zoqvera-schema]').forEach((node) => node.remove());
  const structuredData = document.createElement('script');
  structuredData.type = 'application/ld+json';
  structuredData.dataset.zoqveraSchema = 'true';
  structuredData.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [organization, pageEntity]
  });
  document.head.appendChild(structuredData);
}
