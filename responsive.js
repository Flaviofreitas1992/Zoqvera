(() => {
  const MOBILE_NAV_QUERY = '(max-width: 1020px)';
  const mobileNav = window.matchMedia(MOBILE_NAV_QUERY);
  const responsiveScriptUrl = document.currentScript?.src || new URL('responsive.js', window.location.href).href;

  const ensureHardeningStyles = () => {
    if (document.querySelector('link[data-zoqvera-responsive-hardening]')) return;

    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = new URL('responsive-hardening.css', responsiveScriptUrl).href;
    styles.dataset.zoqveraResponsiveHardening = 'true';
    document.head.appendChild(styles);
  };

  // CSS can be requested immediately; DOM-dependent behavior is initialized later.
  ensureHardeningStyles();

  const getElements = () => ({
    nav: document.querySelector('.main-nav'),
    toggle: document.querySelector('.menu-toggle'),
    servicesMenu: document.querySelector('.ux-services-menu'),
    servicesTrigger: document.querySelector('.ux-services-trigger'),
    navCta: document.querySelector('.nav-cta')
  });

  const closeNavigation = ({ restoreFocus = false } = {}) => {
    const { nav, toggle, servicesMenu, servicesTrigger } = getElements();

    nav?.classList.remove('open');
    servicesMenu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');

    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
    servicesTrigger?.setAttribute('aria-expanded', 'false');

    if (restoreFocus && mobileNav.matches) toggle?.focus();
  };

  const configureToggle = () => {
    const { nav, toggle } = getElements();
    if (!toggle || !nav) return;

    if (!nav.id) nav.id = 'navegacao-principal';
    toggle.setAttribute('aria-controls', nav.id);
  };

  const isVisible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const styles = window.getComputedStyle(element);
    return styles.display !== 'none' && styles.visibility !== 'hidden' && element.getClientRects().length > 0;
  };

  const getMenuFocusableItems = () => {
    const { nav, toggle, navCta } = getElements();
    if (!nav || !toggle) return [];

    const navItems = Array.from(nav.querySelectorAll('a[href], button:not([disabled])'));
    return [toggle, ...navItems, navCta].filter(isVisible);
  };

  const handleBreakpointChange = (event) => {
    if (!event.matches) closeNavigation();
  };

  const handleKeydown = (event) => {
    const { nav, servicesMenu } = getElements();
    const menuIsOpen = nav?.classList.contains('open') || servicesMenu?.classList.contains('is-open');

    if (event.key === 'Escape' && menuIsOpen) {
      closeNavigation({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab' || !mobileNav.matches || !nav?.classList.contains('open')) return;

    const focusable = getMenuFocusableItems();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const current = document.activeElement;

    if (event.shiftKey && (current === first || !focusable.includes(current))) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleOrientationChange = () => {
    // Avoid retaining a stale full-screen menu after a phone/tablet rotates.
    window.requestAnimationFrame(() => closeNavigation());
  };

  const init = () => {
    configureToggle();
    closeNavigation();

    if (typeof mobileNav.addEventListener === 'function') {
      mobileNav.addEventListener('change', handleBreakpointChange);
    } else {
      mobileNav.addListener(handleBreakpointChange);
    }

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('pageshow', () => closeNavigation());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
