// Google Analytics 4 + carregamento do script principal da Zoqvera.
(() => {
  const GA_MEASUREMENT_ID = 'G-FGZGQTZDML';
  const currentScript = document.currentScript;

  if (!window.__zoqveraGa4Loaded) {
    window.__zoqveraGa4Loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    const googleTag = document.createElement('script');
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(googleTag);
  }

  const trackEvent = (eventName, parameters = {}, callback = null) => {
    if (typeof window.gtag !== 'function') {
      callback?.();
      return;
    }

    if (!callback) {
      window.gtag('event', eventName, {
        ...parameters,
        send_to: GA_MEASUREMENT_ID
      });
      return;
    }

    let callbackExecuted = false;
    const runCallbackOnce = () => {
      if (callbackExecuted) return;
      callbackExecuted = true;
      callback();
    };

    window.gtag('event', eventName, {
      ...parameters,
      send_to: GA_MEASUREMENT_ID,
      event_callback: runCallbackOnce,
      event_timeout: 1000
    });

    // Fallback independente do gtag para nunca bloquear a navegação.
    window.setTimeout(runCallbackOnce, 1300);
  };

  const isWhatsappDestination = (destination) => (
    destination?.hostname === 'wa.me' || destination?.hostname?.endsWith('whatsapp.com')
  );

  const isLikelyMobileDevice = () => (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );

  const buildWhatsappAppUrl = (destination) => {
    let phone = '';
    const text = destination.searchParams.get('text') || '';

    if (destination.hostname === 'wa.me') {
      phone = destination.pathname.replace(/^\/+/, '').split('/')[0] || '';
    } else {
      phone = destination.searchParams.get('phone') || '';
    }

    const params = new URLSearchParams();
    const normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone) params.set('phone', normalizedPhone);
    if (text) params.set('text', text);

    const query = params.toString();
    return `whatsapp://send${query ? `?${query}` : ''}`;
  };

  const openWhatsappDestination = (destination) => {
    const fallbackUrl = destination.href;

    // Em desktop, o link web continua sendo o comportamento mais previsível.
    if (!isLikelyMobileDevice()) {
      window.location.assign(fallbackUrl);
      return;
    }

    // Em celular, tenta primeiro o protocolo registrado pelo aplicativo.
    // Se o app não assumir a navegação, usa wa.me como fallback.
    const appUrl = buildWhatsappAppUrl(destination);
    let fallbackTimer;

    const cleanupFallback = () => {
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', cleanupFallback);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) cleanupFallback();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', cleanupFallback, { once: true });

    fallbackTimer = window.setTimeout(() => {
      cleanupFallback();
      window.location.assign(fallbackUrl);
    }, 3000);

    window.location.href = appUrl;
  };

  // Os formulários existentes usam window.open para o WhatsApp. Interceptamos
  // apenas esses destinos e preservamos o comportamento nativo para os demais.
  const nativeWindowOpen = window.open.bind(window);
  window.open = (url, target, features) => {
    try {
      const destination = new URL(url, window.location.href);
      if (isWhatsappDestination(destination)) {
        openWhatsappDestination(destination);
        return null;
      }
    } catch {
      // Se não for possível interpretar a URL, preserva o comportamento nativo.
    }

    return nativeWindowOpen(url, target, features);
  };

  const getLinkPlacement = (link) => {
    if (link.classList.contains('whatsapp-float')) return 'floating_whatsapp';
    if (link.closest('.service-cta')) return 'service_cta';
    if (link.closest('.case-cta')) return 'case_cta';
    if (link.closest('.hero-actions')) return 'hero_cta';
    if (link.closest('.main-nav, .site-header')) return 'header';
    if (link.closest('.site-footer, .service-footer, .case-footer, .insights-footer')) return 'footer';
    return 'page_link';
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    const link = target?.closest('a[href]');
    if (!link) return;

    let destination;
    try {
      destination = new URL(link.getAttribute('href'), window.location.href);
    } catch {
      return;
    }

    const linkText = (link.textContent || link.getAttribute('aria-label') || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
    const placement = getLinkPlacement(link);

    if (isWhatsappDestination(destination)) {
      event.preventDefault();
      trackEvent('whatsapp_click', {
        link_text: linkText,
        placement,
        page_path: window.location.pathname
      }, () => openWhatsappDestination(destination));
      return;
    }

    if (
      destination.origin === window.location.origin &&
      destination.pathname.replace(/\.html$/, '').includes('/solicitar-orcamento')
    ) {
      event.preventDefault();
      const service = destination.searchParams.get('servico') || 'nao_informado';
      trackEvent('quote_start', {
        service,
        link_text: linkText,
        placement,
        page_path: window.location.pathname
      }, () => window.location.assign(destination.href));
      return;
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.id !== 'contact-form' && form.id !== 'quote-form') return;

    const data = new FormData(form);
    const isQuoteForm = form.id === 'quote-form';
    const service = isQuoteForm
      ? String(data.get('service') || 'nao_informado').trim().slice(0, 100)
      : 'contato_geral';

    trackEvent('generate_lead', {
      form_id: form.id,
      lead_source: isQuoteForm ? 'quote_form' : 'contact_form',
      service,
      page_path: window.location.pathname
    });
  }, true);

  // A home funciona como visão geral. O catálogo completo fica em /servicos/.
  const buildHomeServiceOverview = () => {
    const servicesSection = document.querySelector('#servicos');
    const grid = servicesSection?.querySelector('.services-grid');
    if (!grid || grid.dataset.catalogOverview === 'true') return;

    const services = [
      {
        number: '01',
        icon: '↗',
        title: 'Landing Page Profissional',
        description: 'Página única voltada para apresentação, captação de leads ou vendas.',
        tags: ['Apresentação', 'Leads', 'Vendas'],
        query: 'Landing Page Profissional'
      },
      {
        number: '02',
        icon: '▤',
        title: 'Site Institucional',
        description: 'Site completo para empresas apresentarem marca, serviços, diferenciais e canais de contato.',
        tags: ['Empresa', 'Credibilidade', 'Conteúdo'],
        query: 'Site Institucional'
      },
      {
        number: '03',
        icon: '▦',
        title: 'Loja Virtual',
        description: 'Catálogo, carrinho, pagamentos e gestão de produtos para vender online.',
        tags: ['Catálogo', 'Carrinho', 'Pagamentos'],
        query: 'Loja Virtual'
      },
      {
        number: '04',
        icon: '◫',
        title: 'Sistema Web Personalizado',
        description: 'Plataformas e sistemas específicos para processos, regras e necessidades do negócio.',
        tags: ['Regras de negócio', 'Dados', 'Integrações'],
        query: 'Sistema Web Personalizado'
      },
      {
        number: '05',
        icon: '◎',
        title: 'Aplicativo Web',
        description: 'Aplicações acessíveis pelo navegador, adaptadas para celular e computador.',
        tags: ['Navegador', 'Mobile', 'Desktop'],
        query: 'Aplicativo Web'
      },
      {
        number: '06',
        icon: '✦',
        title: 'Integração com Inteligência Artificial',
        description: 'Chatbots, geração de conteúdo, análise de dados e automações com IA.',
        tags: ['Chatbots', 'Automação', 'Análise'],
        query: 'Integração com Inteligência Artificial',
        featured: true
      }
    ];

    grid.innerHTML = services.map((service) => {
      const featuredClass = service.featured ? ' service-card-featured' : '';
      const tags = service.tags.map((tag) => `<li>${tag}</li>`).join('');
      const href = `solicitar-orcamento?servico=${encodeURIComponent(service.query)}`;
      return `<article class="service-card${featuredClass} reveal"><a class="service-card-link" href="${href}" aria-label="Solicitar orçamento para ${service.title}"><span class="service-num">${service.number}</span><div class="service-icon">${service.icon}</div><h3>${service.title}</h3><p>${service.description}</p><ul>${tags}</ul></a></article>`;
    }).join('');

    grid.dataset.catalogOverview = 'true';

    if (!servicesSection.querySelector('.services-overview-footer')) {
      grid.insertAdjacentHTML('afterend', `
        <div class="services-overview-footer reveal">
          <p>Precisa de página de vendas, site para profissional liberal, automação, pagamentos, área do cliente, agendamento, SEO ou suporte técnico?</p>
          <a class="button services-catalog-button" href="servicos/">Ver todos os serviços <span>→</span></a>
        </div>
      `);
    }
  };

  buildHomeServiceOverview();

  const coreScript = document.createElement('script');
  const scriptUrl = currentScript?.src || new URL('/script.js', window.location.origin).href;
  coreScript.src = new URL('script-core.js', scriptUrl).href;
  coreScript.async = false;

  if (currentScript?.parentNode) {
    currentScript.parentNode.insertBefore(coreScript, currentScript.nextSibling);
  } else {
    document.body.appendChild(coreScript);
  }
})();
