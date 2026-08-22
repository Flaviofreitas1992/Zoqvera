// Google Analytics 4 + carregamento das camadas principal, UX e responsividade da Zoqvera.
(() => {
  const GA_MEASUREMENT_ID = 'G-FGZGQTZDML';
  const currentScript = document.currentScript;
  const scriptUrl = currentScript?.src || new URL('/script.js', window.location.origin).href;

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

  if (!document.querySelector('link[data-zoqvera-ux]')) {
    const uxStyles = document.createElement('link');
    uxStyles.rel = 'stylesheet';
    uxStyles.href = new URL('ux-enhancements.css', scriptUrl).href;
    uxStyles.dataset.zoqveraUx = 'true';
    document.head.appendChild(uxStyles);
  }

  if (!document.querySelector('link[data-zoqvera-responsive]')) {
    const responsiveStyles = document.createElement('link');
    responsiveStyles.rel = 'stylesheet';
    responsiveStyles.href = new URL('responsive.css', scriptUrl).href;
    responsiveStyles.dataset.zoqveraResponsive = 'true';
    document.head.appendChild(responsiveStyles);
  }

  if (!document.querySelector('link[data-zoqvera-responsive-content]')) {
    const responsiveContentStyles = document.createElement('link');
    responsiveContentStyles.rel = 'stylesheet';
    responsiveContentStyles.href = new URL('responsive-content.css', scriptUrl).href;
    responsiveContentStyles.dataset.zoqveraResponsiveContent = 'true';
    document.head.appendChild(responsiveContentStyles);
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
    if (link.closest('.ux-needs-section')) return 'needs_section';
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

  const coreScript = document.createElement('script');
  coreScript.src = new URL('script-core.js', scriptUrl).href;
  coreScript.async = false;

  const uxScript = document.createElement('script');
  uxScript.src = new URL('ux-enhancements.js', scriptUrl).href;
  uxScript.async = false;

  const responsiveScript = document.createElement('script');
  responsiveScript.src = new URL('responsive.js', scriptUrl).href;
  responsiveScript.async = false;

  if (currentScript?.parentNode) {
    currentScript.parentNode.insertBefore(coreScript, currentScript.nextSibling);
    currentScript.parentNode.insertBefore(uxScript, coreScript.nextSibling);
    currentScript.parentNode.insertBefore(responsiveScript, uxScript.nextSibling);
  } else {
    document.body.appendChild(coreScript);
    document.body.appendChild(uxScript);
    document.body.appendChild(responsiveScript);
  }
})();
