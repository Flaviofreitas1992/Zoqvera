// Public URLs are extensionless. GitHub Pages serves the existing .html files
// at the same path without the extension, so old URLs remain compatible.
const cleanPublicPath = (pathname) => {
  if (pathname.endsWith('/index.html')) return pathname.slice(0, -'index.html'.length);
  if (pathname.endsWith('.html')) return pathname.slice(0, -'.html'.length);
  return pathname;
};

const publicPath = cleanPublicPath(window.location.pathname);
if (publicPath !== window.location.pathname) {
  window.history.replaceState(null, '', `${publicPath}${window.location.search}${window.location.hash}`);
}

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
  homeQuoteCta.href = 'solicitar-orcamento';
  homeQuoteCta.textContent = 'Solicitar orçamento';
}

const serviceQuoteByPage = {
  'sites-landing-pages': 'Sites e Landing Pages',
  'software-sob-medida': 'Software sob medida',
  'plataformas-digitais': 'Plataformas Digitais',
  'solucoes-de-ia': 'Soluções de IA',
  'evolucao-manutencao': 'Evolução e Manutenção'
};

const serviceNavCta = document.querySelector('.service-nav-cta');
if (serviceNavCta) {
  const currentPage = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const selectedService = serviceQuoteByPage[currentPage];
  const query = selectedService ? `?servico=${encodeURIComponent(selectedService)}` : '';
  serviceNavCta.href = `../solicitar-orcamento${query}`;
  serviceNavCta.textContent = 'Solicitar orçamento';
}

const serviceCards = document.querySelectorAll('.service-card');
const servicePageLinks = [
  ['servicos/sites-landing-pages', 'Conhecer o serviço de sites institucionais'],
  ['servicos/sites-landing-pages', 'Conhecer o serviço de landing pages'],
  ['servicos/software-sob-medida', 'Conhecer o serviço de software sob medida'],
  ['servicos/plataformas-digitais', 'Conhecer o serviço de plataformas digitais'],
  ['servicos/solucoes-de-ia', 'Conhecer o serviço de soluções de inteligência artificial'],
  ['servicos/evolucao-manutencao', 'Conhecer o serviço de evolução, manutenção e modernização']
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
  ['.project-civica .project-link', 'portfolio/civica', 'Ver case da Plataforma Cívica'],
  ['.project-teacher .project-link', 'portfolio/teacher-flavius', 'Ver case do Teacher Flavius'],
  ['.project-cleiton .project-link', 'portfolio/cleiton-rodrigues', 'Ver case do Cleiton Rodrigues']
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
const SEO_BASE_URL = 'https://zoqvera.com';
const currentPathname = window.location.pathname;
const repositoryPrefix = '/Zoqvera/';
const relativeSeoPath = currentPathname.startsWith(repositoryPrefix)
  ? currentPathname.slice(repositoryPrefix.length)
  : currentPathname.replace(/^\/+/, '');
const normalizedSeoPath = relativeSeoPath.replace(/\.html$/, '');
const seoPagePath = !normalizedSeoPath || normalizedSeoPath === 'index.html' ? 'index.html' : normalizedSeoPath;

const seoPages = {
  'index.html': {
    kind: 'website',
    name: 'Zoqvera — Desenvolvimento Web, Software e IA',
    description: 'A Zoqvera desenvolve sites, landing pages, softwares, plataformas e soluções de inteligência artificial sob medida.'
  },
  'servicos/sites-landing-pages': {
    kind: 'service',
    name: 'Sites e Landing Pages',
    description: 'Criação de sites institucionais e landing pages responsivas, claras e orientadas à conversão para profissionais e empresas.'
  },
  'servicos/software-sob-medida': {
    kind: 'service',
    name: 'Software sob medida',
    description: 'Desenvolvimento de sistemas e softwares web sob medida para organizar operações, automatizar processos e conectar dados, pagamentos e usuários.'
  },
  'servicos/plataformas-digitais': {
    kind: 'service',
    name: 'Plataformas Digitais',
    description: 'Desenvolvimento de plataformas digitais, portais e aplicações web com autenticação, dados, painéis, fluxos e integrações sob medida.'
  },
  'servicos/solucoes-de-ia': {
    kind: 'service',
    name: 'Soluções de IA',
    description: 'Soluções de inteligência artificial conectadas a dados e processos reais: assistentes, análise, automação e funcionalidades inteligentes sob medida.'
  },
  'servicos/evolucao-manutencao': {
    kind: 'service',
    name: 'Evolução, Manutenção e Modernização',
    description: 'Evolução contínua de sites, sistemas e plataformas com novas funcionalidades, correções, performance, segurança e modernização técnica.'
  },
  'portfolio/civica': {
    kind: 'case',
    name: 'Case Plataforma Cívica — Zoqvera',
    description: 'Case de uma plataforma orientada a dados para apoiar análise e comparação de políticas públicas com metodologia auditável.'
  },
  'portfolio/teacher-flavius': {
    kind: 'case',
    name: 'Case Teacher Flavius — Zoqvera',
    description: 'Case de um ecossistema web educacional com área do estudante, gestão acadêmica, pagamentos e automações.'
  },
  'portfolio/cleiton-rodrigues': {
    kind: 'case',
    name: 'Case Cleiton Rodrigues — Zoqvera',
    description: 'Case de uma landing page profissional para psicologia e psicanálise com posicionamento, experiência responsiva e conversão para WhatsApp.'
  },
  'solicitar-orcamento': {
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

// FAQs de cauda longa para as páginas de serviço.
// O conteúdo visível e o FAQPage usam a mesma fonte de dados.
const serviceFaqs = {
  'sites-landing-pages': {
    heading: 'Perguntas sobre criação de sites e landing pages',
    intro: 'Respostas objetivas para dúvidas comuns antes de contratar um site profissional ou uma landing page.',
    items: [
      {
        question: 'Qual é a diferença entre site institucional e landing page?',
        answer: 'Um site institucional normalmente apresenta a empresa ou profissional de forma mais ampla, com serviços, diferenciais, portfólio e contato. Uma landing page é mais focada: organiza a mensagem em torno de uma oferta ou objetivo principal e reduz distrações para conduzir o visitante a uma ação específica.'
      },
      {
        question: 'Quanto custa criar um site profissional?',
        answer: 'O valor depende do número de páginas, complexidade visual, conteúdo, integrações, formulários, necessidades de SEO e funcionalidades adicionais. Um orçamento confiável só pode ser definido depois de entender objetivo, escopo e materiais disponíveis.'
      },
      {
        question: 'Quanto tempo leva para criar um site ou landing page?',
        answer: 'O prazo varia conforme escopo, quantidade de conteúdo, revisões e integrações. Uma página simples tende a exigir menos etapas do que um site institucional completo. O cronograma é definido depois do briefing e da priorização das entregas.'
      },
      {
        question: 'O site funciona bem no celular?',
        answer: 'Sim. O projeto é desenvolvido com layout responsivo para adaptar navegação, conteúdo e componentes a diferentes tamanhos de tela. A experiência mobile é tratada como parte do produto, não como uma versão separada feita no final.'
      },
      {
        question: 'Um site novo já vem preparado para SEO?',
        answer: 'A estrutura pode incluir fundamentos de SEO técnico e on-page, como títulos, descrições, hierarquia de headings, URLs, Open Graph, sitemap, dados estruturados e performance. Posicionamento orgânico, porém, também depende de concorrência, autoridade, conteúdo e tempo de indexação.'
      },
      {
        question: 'É possível integrar WhatsApp, formulários e outros serviços ao site?',
        answer: 'Sim. Dependendo do projeto, a página pode integrar WhatsApp, formulários, pagamentos, analytics, ferramentas de automação, APIs e outros serviços. Cada integração é avaliada de acordo com a jornada do usuário e a necessidade real do negócio.'
      }
    ]
  },
  'software-sob-medida': {
    heading: 'Perguntas sobre desenvolvimento de software sob medida',
    intro: 'Dúvidas frequentes de empresas que precisam substituir planilhas, processos manuais ou ferramentas genéricas por um sistema próprio.',
    items: [
      {
        question: 'O que é software sob medida e quando vale a pena?',
        answer: 'É um sistema construído em torno das regras, usuários e processos específicos de uma operação. Faz sentido quando ferramentas prontas geram retrabalho, não representam bem o fluxo real, exigem muitas adaptações ou impedem automações e integrações importantes.'
      },
      {
        question: 'Quanto custa desenvolver um software sob medida?',
        answer: 'O custo depende do escopo: perfis de usuário, regras de negócio, telas, banco de dados, integrações, pagamentos, segurança, automações e nível de complexidade operacional. A estimativa é feita depois de mapear o problema e definir o núcleo do produto.'
      },
      {
        question: 'Quanto tempo leva para desenvolver um sistema sob medida?',
        answer: 'Não existe um prazo único. Sistemas podem ser divididos em etapas, começando por um MVP ou por um fluxo prioritário. O cronograma depende da quantidade de regras, integrações, dados, interfaces e validações necessárias.'
      },
      {
        question: 'Um software sob medida pode substituir planilhas e processos manuais?',
        answer: 'Em muitos casos, sim. O sistema pode centralizar registros, aplicar regras automaticamente, controlar permissões, disparar notificações e reduzir tarefas repetitivas. O primeiro passo é identificar quais partes do processo realmente devem ser automatizadas.'
      },
      {
        question: 'É possível integrar o sistema com pagamentos, e-mail e APIs?',
        answer: 'Sim. Sistemas web podem se conectar a gateways de pagamento, serviços de e-mail, autenticação, bancos de dados, webhooks e APIs externas. A arquitetura precisa considerar segurança, limites e comportamento de cada integração.'
      },
      {
        question: 'O software pode continuar evoluindo depois do lançamento?',
        answer: 'Sim. Uma arquitetura adequada permite adicionar funcionalidades, ajustar regras e integrar novos serviços em ciclos posteriores. O ideal é priorizar primeiro o núcleo que gera valor e evoluir o produto conforme a operação produz novas necessidades.'
      }
    ]
  },
  'plataformas-digitais': {
    heading: 'Perguntas sobre desenvolvimento de plataformas digitais e SaaS',
    intro: 'Questões comuns antes de transformar uma ideia em portal, SaaS, área logada ou aplicação web multiusuário.',
    items: [
      {
        question: 'Qual é a diferença entre site, sistema e plataforma digital?',
        answer: 'Um site é principalmente uma experiência de conteúdo e presença digital. Um sistema executa regras e processos específicos. Uma plataforma normalmente conecta vários usuários, dados, permissões e fluxos em uma experiência contínua, podendo incluir áreas logadas, dashboards, pagamentos e integrações.'
      },
      {
        question: 'Quanto custa desenvolver uma plataforma digital ou SaaS?',
        answer: 'O investimento varia conforme perfis de usuário, funcionalidades, regras de negócio, dados, integrações, cobrança, segurança e complexidade do produto. Para estimar com responsabilidade, primeiro é necessário definir o problema, o público e o escopo do MVP.'
      },
      {
        question: 'Quanto tempo leva para desenvolver uma plataforma?',
        answer: 'Depende do tamanho do MVP e das integrações necessárias. Em vez de tentar construir todo o produto de uma vez, costuma ser mais eficiente separar o desenvolvimento em etapas e validar primeiro os fluxos que sustentam a proposta de valor.'
      },
      {
        question: 'O que é um MVP de plataforma digital?',
        answer: 'É a primeira versão funcional com o conjunto mínimo de capacidades necessárias para resolver o problema central e testar a proposta com usuários reais. MVP não significa produto improvisado; significa priorização deliberada do que precisa existir primeiro.'
      },
      {
        question: 'Uma plataforma pode ter diferentes tipos de usuário e permissões?',
        answer: 'Sim. É possível criar papéis como administrador, equipe, cliente, aluno, parceiro ou outros perfis, cada um com acessos e jornadas específicas. As regras de autorização devem ser definidas desde a arquitetura para proteger dados e operações.'
      },
      {
        question: 'É possível começar com uma plataforma pequena e escalar depois?',
        answer: 'Sim. Uma estratégia comum é começar pelo núcleo de valor, estruturar bem dados e regras e ampliar o produto por ciclos. Escalabilidade envolve tanto arquitetura técnica quanto clareza sobre quais funcionalidades realmente precisam ser adicionadas.'
      }
    ]
  },
  'solucoes-de-ia': {
    heading: 'Perguntas sobre inteligência artificial para empresas',
    intro: 'Respostas para empresas que avaliam usar assistentes, automação, análise ou IA integrada aos próprios produtos e dados.',
    items: [
      {
        question: 'Como saber se minha empresa realmente precisa de inteligência artificial?',
        answer: 'IA faz mais sentido quando a tarefa exige interpretação de linguagem, classificação, síntese, busca contextual, geração assistida ou decisões baseadas em padrões difíceis de expressar apenas por regras fixas. Se uma regra determinística resolver melhor, software convencional tende a ser mais seguro e previsível.'
      },
      {
        question: 'Que processos de uma empresa podem ser automatizados com IA?',
        answer: 'Alguns exemplos são triagem de textos, extração de informações, organização de documentos, busca contextual, preparação de respostas, classificação e apoio analítico. A automação deve ser definida tarefa por tarefa, considerando custo, risco de erro e necessidade de revisão humana.'
      },
      {
        question: 'Qual é a diferença entre um assistente de IA e um chatbot comum?',
        answer: 'Um chatbot tradicional costuma seguir fluxos ou respostas predefinidas. Um assistente de IA pode interpretar linguagem mais livre, usar contexto e executar tarefas mais flexíveis. Ainda assim, ele precisa de limites, fontes confiáveis e regras claras para funcionar dentro de uma operação real.'
      },
      {
        question: 'Uma solução de IA pode consultar documentos e dados da empresa?',
        answer: 'Sim, desde que a arquitetura trate permissões, fontes, segurança e proveniência corretamente. A solução pode combinar modelos de linguagem com documentos, APIs e dados estruturados sem transformar toda informação interna em conhecimento irrestrito do modelo.'
      },
      {
        question: 'Como reduzir erros e alucinações em sistemas de IA?',
        answer: 'A mitigação pode combinar contexto controlado, fontes verificáveis, saídas estruturadas, validações determinísticas, casos de teste, fallbacks e revisão humana nos pontos de maior risco. Nenhum desses mecanismos elimina completamente a incerteza, por isso o nível de controle deve acompanhar o impacto da tarefa.'
      },
      {
        question: 'Quanto custa desenvolver uma solução de inteligência artificial?',
        answer: 'O custo depende da aplicação, dos modelos utilizados, volume de uso, integrações, dados, interface, avaliação e requisitos de segurança. Uma solução simples integrada a um fluxo existente é muito diferente de um produto completo com múltiplos usuários e fontes de dados.'
      }
    ]
  },
  'evolucao-manutencao': {
    heading: 'Perguntas sobre manutenção e modernização de sistemas',
    intro: 'Dúvidas de empresas que já possuem um site, sistema ou plataforma e precisam corrigir, ampliar ou modernizar a base existente.',
    items: [
      {
        question: 'Vale mais a pena modernizar um sistema existente ou refazer do zero?',
        answer: 'Depende da qualidade da base atual, dos riscos, da dívida técnica e do quanto o sistema ainda atende à operação. Reescrever tudo pode ser caro e arriscado. Muitas vezes é melhor modernizar por etapas, preservando o que funciona e substituindo apenas o que realmente limita o produto.'
      },
      {
        question: 'É possível assumir a manutenção de um sistema criado por outra equipe?',
        answer: 'Sim, desde que seja possível acessar e avaliar código, infraestrutura, dependências, banco de dados e documentação disponíveis. Antes de alterar o produto, é necessário fazer um diagnóstico para entender riscos, arquitetura e pontos críticos.'
      },
      {
        question: 'O que pode estar incluído na manutenção de software?',
        answer: 'O trabalho pode envolver correções, novas funcionalidades, atualizações de dependências, performance, segurança, integrações, ajustes de banco de dados e redução de dívida técnica. O escopo concreto é definido depois da análise do sistema existente.'
      },
      {
        question: 'Como modernizar um sistema legado sem parar a operação?',
        answer: 'Uma abordagem comum é dividir a modernização em intervenções menores, mapear dependências, priorizar áreas críticas e substituir componentes gradualmente. O plano precisa considerar dados, integrações e comportamento atual para reduzir o risco de regressões.'
      },
      {
        question: 'É possível adicionar novas funcionalidades sem reconstruir o sistema inteiro?',
        answer: 'Muitas vezes, sim. A viabilidade depende da arquitetura atual e do acoplamento entre componentes. Um diagnóstico técnico ajuda a decidir se a nova funcionalidade pode ser incorporada com segurança ou se alguma parte da base precisa ser refatorada antes.'
      },
      {
        question: 'A manutenção pode ser feita de forma recorrente?',
        answer: 'Pode. A atuação pode ocorrer em projetos pontuais ou em ciclos recorrentes de evolução, dependendo do volume de demandas e da criticidade da operação. Frequência, prioridades e responsabilidades precisam ser formalizadas no escopo contratado.'
      }
    ]
  }
};

const currentServiceFile = window.location.pathname.split('/').pop();
const currentFaq = serviceFaqs[currentServiceFile];
const serviceCta = document.querySelector('.service-cta');

if (currentFaq && serviceCta && !document.querySelector('.service-faq')) {
  const faqSection = document.createElement('section');
  faqSection.className = 'service-section service-faq';
  faqSection.id = 'perguntas-frequentes';
  faqSection.innerHTML = `
    <div class="container">
      <div class="service-section-head">
        <span class="service-index">FAQ / DÚVIDAS FREQUENTES</span>
        <div class="service-copy">
          <h2>${currentFaq.heading}</h2>
          <p>${currentFaq.intro}</p>
        </div>
      </div>
      <div class="service-faq-list">
        ${currentFaq.items.map((item) => `
          <details class="service-faq-item">
            <summary>${item.question}<span aria-hidden="true">+</span></summary>
            <div class="service-faq-answer"><p>${item.answer}</p></div>
          </details>
        `).join('')}
      </div>
    </div>
  `;
  serviceCta.parentNode.insertBefore(faqSection, serviceCta);

  const faqStyles = document.createElement('style');
  faqStyles.textContent = `
    .service-faq{background:#0a1016}
    .service-faq-list{margin-top:58px;border-top:1px solid var(--service-line)}
    .service-faq-item{border-bottom:1px solid var(--service-line)}
    .service-faq-item summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:27px 0;font-size:19px;font-weight:700;line-height:1.35;letter-spacing:-.025em}
    .service-faq-item summary::-webkit-details-marker{display:none}
    .service-faq-item summary span{flex:0 0 auto;width:32px;height:32px;border:1px solid var(--service-line);border-radius:50%;display:grid;place-items:center;color:var(--service-accent);font:500 20px/1 'DM Mono',monospace;transition:transform .2s ease,border-color .2s ease}
    .service-faq-item[open] summary span{transform:rotate(45deg);border-color:rgba(134,255,183,.45)}
    .service-faq-answer{max-width:850px;padding:0 58px 27px 0}
    .service-faq-answer p{margin:0;color:var(--service-muted);font-size:15px;line-height:1.8}
    @media(max-width:640px){.service-faq-list{margin-top:42px}.service-faq-item summary{font-size:17px;padding:22px 0}.service-faq-answer{padding-right:0}.service-faq-item summary span{width:30px;height:30px}}
    @media(prefers-reduced-motion:reduce){.service-faq-item summary span{transition:none}}
  `;
  document.head.appendChild(faqStyles);

  document.querySelectorAll('script[data-zoqvera-faq-schema]').forEach((node) => node.remove());
  const faqStructuredData = document.createElement('script');
  faqStructuredData.type = 'application/ld+json';
  faqStructuredData.dataset.zoqveraFaqSchema = 'true';
  faqStructuredData.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SEO_BASE_URL}/servicos/${currentServiceFile}#faq`,
    mainEntity: currentFaq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  });
  document.head.appendChild(faqStructuredData);
}