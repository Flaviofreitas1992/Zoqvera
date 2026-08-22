(() => {
  const ROOT = new URL('./', document.currentScript?.src || window.location.href);
  const normalizedPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const isHome = normalizedPath === '/';
  const isQuotePage = document.body.classList.contains('quote-page');
  const isServicePage = document.body.classList.contains('service-page');

  // As páginas atuais de serviço representam categorias amplas. Não pré-selecionamos
  // um produto específico no orçamento para evitar induzir uma escolha incorreta.
  const serviceByPage = {};

  const rootUrl = (path = '') => new URL(path, ROOT).href;
  const quoteUrl = (service = '') => {
    const url = new URL('solicitar-orcamento', ROOT);
    if (service) url.searchParams.set('servico', service);
    return url.href;
  };

  const getCurrentService = () => {
    const slug = window.location.pathname.split('/').filter(Boolean).pop()?.replace(/\.html$/, '') || '';
    return serviceByPage[slug] || '';
  };

  const addSkipLink = () => {
    const main = document.querySelector('main');
    if (!main || document.querySelector('.ux-skip-link')) return;
    if (!main.id) main.id = 'conteudo-principal';
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');

    const link = document.createElement('a');
    link.className = 'ux-skip-link';
    link.href = `#${main.id}`;
    link.textContent = 'Pular para o conteúdo principal';
    document.body.prepend(link);
  };

  const announce = (message) => {
    let region = document.querySelector('#ux-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'ux-live-region';
      region.className = 'ux-sr-only';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    region.textContent = '';
    window.setTimeout(() => { region.textContent = message; }, 20);
  };

  const enhanceHomeHeader = () => {
    if (!isHome) return;

    const brand = document.querySelector('.site-header .brand');
    if (brand) brand.href = '#topo';

    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    nav.innerHTML = `
      <a href="#topo" data-nav-section="topo">Início</a>
      <div class="ux-services-menu">
        <button class="ux-services-trigger" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="ux-services-panel">
          Serviços <span aria-hidden="true">▾</span>
        </button>
        <div class="ux-services-panel" id="ux-services-panel">
          <a href="${rootUrl('servicos/sites-landing-pages')}"><span>Sites</span><small>Landing pages, sites profissionais e páginas de vendas</small></a>
          <a href="${rootUrl('servicos/plataformas-digitais')}"><span>Comércio digital</span><small>Lojas, pagamentos, áreas do cliente e agendamentos</small></a>
          <a href="${rootUrl('servicos/software-sob-medida')}"><span>Sistemas</span><small>Software e aplicações web sob medida</small></a>
          <a href="${rootUrl('servicos/solucoes-de-ia')}"><span>IA e automação</span><small>Integrações de IA e automação de atendimento</small></a>
          <a href="${rootUrl('servicos/evolucao-manutencao')}"><span>Manutenção e evolução</span><small>Modernização, performance, SEO e suporte</small></a>
          <a class="ux-services-all" href="#servicos">Ver todos os serviços <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <a href="#portfolio" data-nav-section="portfolio">Projetos</a>
      <a href="#sobre" data-nav-section="sobre">Sobre</a>
      <a href="#contato" data-nav-section="contato">Contato</a>
    `;

    const trigger = nav.querySelector('.ux-services-trigger');
    const menu = nav.querySelector('.ux-services-menu');

    const setServicesMenu = (open) => {
      menu?.classList.toggle('is-open', open);
      trigger?.setAttribute('aria-expanded', String(open));
    };

    trigger?.addEventListener('click', () => {
      setServicesMenu(trigger.getAttribute('aria-expanded') !== 'true');
    });

    menu?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setServicesMenu(false);
        trigger?.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (menu && !menu.contains(event.target)) setServicesMenu(false);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setServicesMenu(false);
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
        const toggle = document.querySelector('.menu-toggle');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Abrir menu');
      });
    });

    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
      navCta.href = quoteUrl();
      navCta.textContent = 'Solicitar orçamento';
      navCta.classList.remove('button-outline');
      navCta.classList.add('button-primary');
      navCta.setAttribute('aria-label', 'Solicitar orçamento para um projeto');
    }
  };

  const enhanceHero = () => {
    if (!isHome) return;
    const actions = document.querySelector('.hero-actions');
    if (!actions) return;

    const primary = actions.querySelector('.button');
    if (primary) {
      primary.href = quoteUrl();
      primary.innerHTML = 'Solicitar orçamento <span aria-hidden="true">↗</span>';
      primary.setAttribute('data-cta', 'hero_quote');
    }

    const secondary = actions.querySelector('.text-link');
    if (secondary) {
      secondary.href = '#servicos';
      secondary.innerHTML = 'Ver serviços <span aria-hidden="true">↓</span>';
    }
  };

  const insertNeedFinder = () => {
    if (!isHome || document.querySelector('#necessidades')) return;
    const services = document.querySelector('#servicos');
    if (!services) return;

    const section = document.createElement('section');
    section.className = 'ux-needs-section';
    section.id = 'necessidades';
    section.setAttribute('aria-labelledby', 'ux-needs-title');
    section.innerHTML = `
      <div class="container">
        <div class="ux-needs-heading">
          <div>
            <span class="section-index">01 / ENCONTRE SUA SOLUÇÃO</span>
            <h2 id="ux-needs-title">Comece pelo que você precisa resolver.</h2>
          </div>
          <p>Você não precisa conhecer o nome técnico da solução. Escolha o objetivo mais próximo do seu momento.</p>
        </div>
        <div class="ux-needs-grid">
          <a class="ux-need-card" href="${rootUrl('servicos/sites-landing-pages')}"><span>01</span><strong>Quero apresentar meu negócio melhor</strong><p>Sites profissionais, landing pages e páginas de vendas.</p><b>Ver soluções para sites →</b></a>
          <a class="ux-need-card" href="${rootUrl('servicos/plataformas-digitais')}"><span>02</span><strong>Quero vender pela internet</strong><p>Loja virtual, pagamentos e estrutura de comércio digital.</p><b>Ver solução para vendas →</b></a>
          <a class="ux-need-card" href="${rootUrl('servicos/software-sob-medida')}"><span>03</span><strong>Preciso digitalizar um processo</strong><p>Sistemas, aplicações web e fluxos personalizados.</p><b>Ver sistemas sob medida →</b></a>
          <a class="ux-need-card" href="${rootUrl('servicos/solucoes-de-ia')}"><span>04</span><strong>Quero automatizar ou usar IA</strong><p>Atendimento, conteúdo, análise e automações inteligentes.</p><b>Ver soluções de IA →</b></a>
          <a class="ux-need-card" href="${rootUrl('servicos/evolucao-manutencao')}"><span>05</span><strong>Meu site ou sistema precisa evoluir</strong><p>Modernização, performance, SEO, correções e manutenção.</p><b>Ver evolução e suporte →</b></a>
        </div>
      </div>
    `;
    services.before(section);
  };

  const updateHomeSectionIndexes = () => {
    if (!isHome) return;
    const sections = [
      ['#servicos .section-index', '02 / SERVIÇOS'],
      ['#portfolio .section-index', '03 / PORTFÓLIO'],
      ['#competencia .section-index', '04 / COMPETÊNCIA'],
      ['#processo .section-index', '05 / PROCESSO'],
      ['#sobre .section-index', '06 / ZOQVERA'],
      ['#insights .section-index', '07 / INSIGHTS'],
      ['#contato .section-index', '08 / CONTATO']
    ];
    sections.forEach(([selector, label]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = label;
    });
  };

  const improveServicesDiscovery = () => {
    if (!isHome) return;
    const grid = document.querySelector('.services-grid');
    if (!grid || grid.dataset.uxEnhanced === 'true') return;
    grid.dataset.uxEnhanced = 'true';

    const serviceRouteByTitle = new Map([
      ['Landing Page Profissional', 'servicos/sites-landing-pages'],
      ['Site Institucional', 'servicos/sites-landing-pages'],
      ['Site para Profissionais Liberais', 'servicos/sites-landing-pages'],
      ['Página de Vendas', 'servicos/sites-landing-pages'],
      ['Loja Virtual', 'servicos/plataformas-digitais'],
      ['Integração de Pagamentos', 'servicos/plataformas-digitais'],
      ['Área do Cliente', 'servicos/plataformas-digitais'],
      ['Sistema de Agendamento', 'servicos/plataformas-digitais'],
      ['Sistema Web Personalizado', 'servicos/software-sob-medida'],
      ['Aplicativo Web', 'servicos/software-sob-medida'],
      ['Integração com Inteligência Artificial', 'servicos/solucoes-de-ia'],
      ['Automação de Atendimento', 'servicos/solucoes-de-ia'],
      ['Reformulação de Site', 'servicos/evolucao-manutencao'],
      ['Manutenção de Site', 'servicos/evolucao-manutencao'],
      ['SEO', 'servicos/evolucao-manutencao'],
      ['Configuração de Domínio e HTTPS', 'servicos/evolucao-manutencao'],
      ['Configuração Google Search Console', 'servicos/evolucao-manutencao'],
      ['Google Analytics', 'servicos/evolucao-manutencao']
    ]);

    const cards = Array.from(grid.querySelectorAll('.service-card'));
    cards.forEach((card) => {
      const title = card.querySelector('h3')?.textContent.trim() || '';
      const route = serviceRouteByTitle.get(title);
      const link = card.querySelector('.service-card-link');
      if (route && link) {
        link.href = rootUrl(route);
        link.setAttribute('aria-label', `Conhecer a solução para ${title}`);
      }
    });

    if (cards.length <= 8) return;

    cards.slice(8).forEach((card) => card.classList.add('ux-service-extra'));
    grid.classList.add('ux-services-collapsed');

    const controls = document.createElement('div');
    controls.className = 'ux-services-controls';
    controls.innerHTML = '<button class="button button-outline ux-services-toggle" type="button" aria-expanded="false">Ver todos os serviços <span aria-hidden="true">↓</span></button>';
    grid.after(controls);

    const button = controls.querySelector('button');
    button?.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      grid.classList.toggle('ux-services-collapsed', expanded);
      button.setAttribute('aria-expanded', String(!expanded));
      button.innerHTML = expanded
        ? 'Ver todos os serviços <span aria-hidden="true">↓</span>'
        : 'Mostrar menos <span aria-hidden="true">↑</span>';
      announce(expanded ? 'Lista de serviços reduzida.' : 'Todos os serviços estão visíveis.');
      if (expanded) document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const enhanceServicePage = () => {
    if (!isServicePage) return;
    const service = getCurrentService();
    const quote = quoteUrl(service);

    const navCta = document.querySelector('.service-nav-cta');
    if (navCta) {
      navCta.href = quote;
      navCta.textContent = 'Solicitar orçamento';
      navCta.classList.remove('button-outline');
      navCta.classList.add('button-primary');
    }

    const actions = document.querySelector('.service-actions');
    if (actions) {
      const primary = actions.querySelector('.button-primary');
      const secondary = actions.querySelector('.service-secondary');
      const whatsappHref = primary?.href || '';
      const scopeHref = secondary?.getAttribute('href') || '#escopo';

      if (primary) {
        primary.href = quote;
        primary.removeAttribute('target');
        primary.removeAttribute('rel');
        primary.innerHTML = 'Solicitar orçamento <span aria-hidden="true">↗</span>';
      }

      if (secondary && whatsappHref) {
        secondary.href = whatsappHref;
        secondary.target = '_blank';
        secondary.rel = 'noopener noreferrer';
        secondary.innerHTML = 'Falar pelo WhatsApp <span aria-hidden="true">↗</span>';
      }

      if (!actions.querySelector('.ux-service-scope-link')) {
        const scope = document.createElement('a');
        scope.className = 'ux-service-scope-link';
        scope.href = scopeHref;
        scope.innerHTML = 'Ver o que está incluído <span aria-hidden="true">↓</span>';
        actions.appendChild(scope);
      }
    }

    const finalActions = document.querySelector('.service-cta-actions');
    if (finalActions) {
      const primary = finalActions.querySelector('.button-primary');
      const secondary = finalActions.querySelector('.button-outline');
      const whatsappHref = primary?.href || '';

      if (primary) {
        primary.href = quote;
        primary.removeAttribute('target');
        primary.removeAttribute('rel');
        primary.innerHTML = 'Solicitar orçamento <span aria-hidden="true">↗</span>';
      }
      if (secondary && whatsappHref) {
        secondary.href = whatsappHref;
        secondary.target = '_blank';
        secondary.rel = 'noopener noreferrer';
        secondary.textContent = 'Falar pelo WhatsApp';
      }
    }
  };

  const simplifyQuoteForm = () => {
    if (!isQuotePage) return;
    const form = document.querySelector('#quote-form');
    if (!form || form.dataset.uxSimplified === 'true') return;
    form.dataset.uxSimplified = 'true';

    const intro = document.querySelector('.quote-intro > p');
    if (intro) intro.textContent = 'Conte apenas o essencial para entendermos sua necessidade. Você não precisa chegar com um briefing completo nem saber qual solução técnica escolher.';

    const formHead = document.querySelector('.quote-form-head strong');
    if (formHead) formHead.textContent = 'Conte o essencial sobre o projeto';

    ['company', 'stage', 'features', 'timeline', 'reference', 'notes'].forEach((name) => {
      const field = form.elements.namedItem(name);
      if (!(field instanceof HTMLElement)) return;
      field.removeAttribute('required');
      const label = field.closest('label');
      if (label) label.remove();
    });

    const email = form.elements.namedItem('email');
    if (email instanceof HTMLInputElement) {
      email.removeAttribute('required');
      const label = email.closest('label');
      const caption = label?.querySelector('span');
      if (caption) caption.textContent = 'E-mail (opcional)';
    }

    const phone = form.elements.namedItem('phone');
    if (phone instanceof HTMLInputElement) {
      phone.setAttribute('inputmode', 'tel');
      phone.setAttribute('aria-describedby', 'quote-contact-help');
    }

    const firstTwoColumns = form.querySelectorAll('.quote-fields-two');
    firstTwoColumns.forEach((row) => {
      if (row.children.length === 1) row.classList.add('ux-single-field');
    });

    const contactHelp = document.createElement('p');
    contactHelp.id = 'quote-contact-help';
    contactHelp.className = 'ux-field-help';
    contactHelp.textContent = 'Usaremos seu WhatsApp apenas para responder a esta solicitação.';
    phone?.closest('label')?.appendChild(contactHelp);

    const service = form.elements.namedItem('service');
    if (service instanceof HTMLSelectElement) {
      const label = service.closest('label')?.querySelector('span');
      if (label) label.textContent = 'Qual solução parece mais próxima do que você precisa? *';
      const serviceFromUrl = new URLSearchParams(window.location.search).get('servico');
      if (serviceFromUrl && Array.from(service.options).some((option) => option.value === serviceFromUrl)) {
        service.value = serviceFromUrl;
      }
    }

    const problem = form.elements.namedItem('problem');
    if (problem instanceof HTMLTextAreaElement) {
      const label = problem.closest('label')?.querySelector('span');
      if (label) label.textContent = 'Conte brevemente o que você precisa resolver *';
      problem.rows = 5;
      problem.placeholder = 'Ex.: preciso apresentar meus serviços com mais profissionalismo e receber contatos pelo WhatsApp.';
    }

    const submit = form.querySelector('.quote-submit');
    if (submit) submit.innerHTML = 'Continuar pelo WhatsApp <span aria-hidden="true">↗</span>';

    const status = document.querySelector('#quote-status');
    if (status) {
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.textContent = 'Nada é enviado automaticamente. O WhatsApp abrirá com uma mensagem pronta para você revisar antes do envio.';
    }
  };

  const improveFormFeedback = () => {
    document.querySelectorAll('form').forEach((form) => {
      form.addEventListener('invalid', (event) => {
        const field = event.target;
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
        field.setAttribute('aria-invalid', 'true');
      }, true);

      form.addEventListener('input', (event) => {
        const field = event.target;
        if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return;
        if (field.validity.valid) field.removeAttribute('aria-invalid');
      });
    });
  };

  const markCurrentNavigation = () => {
    if (isHome && !window.location.hash) {
      document.querySelector('.main-nav a[href="#topo"]')?.setAttribute('aria-current', 'page');
      return;
    }

    if (isServicePage) {
      document.querySelector('.service-nav a[href*="#servicos"]')?.setAttribute('aria-current', 'page');
    }
  };

  const trackEnhancedCtas = () => {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('a,button') : null;
      if (!target) return;

      const label = (target.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100);
      const isCta = target.matches('.nav-cta, .button-primary, .ux-need-card, .ux-services-toggle');
      if (!isCta || typeof window.gtag !== 'function') return;

      window.gtag('event', 'ux_cta_click', {
        cta_label: label,
        page_path: window.location.pathname,
        section: target.closest('section')?.id || (target.closest('header') ? 'header' : 'page')
      });
    });
  };

  const init = () => {
    document.documentElement.classList.add('ux-enhanced');
    addSkipLink();
    enhanceHomeHeader();
    enhanceHero();
    insertNeedFinder();
    updateHomeSectionIndexes();
    improveServicesDiscovery();
    enhanceServicePage();
    simplifyQuoteForm();
    improveFormFeedback();
    markCurrentNavigation();
    trackEnhancedCtas();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();