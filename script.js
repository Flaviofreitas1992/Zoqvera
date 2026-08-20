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

  const trackEvent = (eventName, parameters = {}) => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, parameters);
  };

  const isWhatsappDestination = (destination) => (
    destination?.hostname === 'wa.me' || destination?.hostname?.endsWith('whatsapp.com')
  );

  // Em alguns navegadores móveis/webviews, abrir o WhatsApp em uma nova aba
  // pode ser bloqueado. Mantemos a navegação no mesmo contexto para permitir
  // que o navegador encaminhe corretamente para o aplicativo.
  const nativeWindowOpen = window.open.bind(window);
  window.open = (url, target, features) => {
    try {
      const destination = new URL(url, window.location.href);
      if (isWhatsappDestination(destination)) {
        window.location.assign(destination.href);
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
        page_path: window.location.pathname,
        transport_type: 'beacon'
      });
      window.location.assign(destination.href);
      return;
    }

    if (
      destination.origin === window.location.origin &&
      destination.pathname.replace(/\.html$/, '').includes('/solicitar-orcamento')
    ) {
      const service = destination.searchParams.get('servico') || 'nao_informado';
      trackEvent('quote_start', {
        service,
        link_text: linkText,
        placement,
        page_path: window.location.pathname,
        transport_type: 'beacon'
      });
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
      page_path: window.location.pathname,
      transport_type: 'beacon'
    });
  }, true);

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
